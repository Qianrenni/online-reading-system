<template>
	<view class="container">
		<!-- <webEdit editHeight="75vh"  :initialContent="initialContent" ref="editor"></webEdit> -->
		<mosowe-editor :modelValue="initialContent" height="600" class="left-content" ref="editor"></mosowe-editor>
		<view class="right-content">
			<view class="phone-frame">


				<scroll-view scroll-y="true" style="height:600px ;" :show-scrollbar="false">
					<u-parse2 :html="currentChapterContent"></u-parse2>
				</scroll-view>
			</view>
			<view class="button-container">
				<button style="border: 2px blue solid;" @click="updateChapterIndex(currentChapterIndex-1)">上一章</button>
				<button type="primary" @click="saveEditorContent">同步更改</button>

				<button style="border: 2px blue solid;" @click="updateChapterIndex(currentChapterIndex+1)">下一章</button>
				<button type="primary" @click="uploadServer">上传</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import store from '../../store';

	export default {
		data() {
			return {
				initialContent: '获取内容出错!',
				currentChapterIndex: 1,
				chapterContent: [],
				catalog: [],
				currentChapterContent: '',
				chapterContentCache: {}
			};
		},
		computed: {
			...mapState({
				book: state => state.book
			})
		},
		mounted() {

		},
		methods: {
			async saveEditorContent() {
				try {
					// 获取左侧编辑器的内容
					const newBodyContent = await this.$refs.editor.getEditorContent();
					// console.log(newBodyContent);
					// 使用 DOMParser 解析 HTML
					const parser = new DOMParser();
					// 解析左侧编辑的内容
					const newBodyDoc = parser.parseFromString(newBodyContent, 'text/html');
					const newBody = newBodyDoc.body;
					// 生成更新后的完整 HTML
					const updatedHtml = `
                <!DOCTYPE html>
                <html>
                    <head></head>
                    <body>${newBody.outerHTML}</body>
                </html>
            `;

					// 更新右侧的 HTML 内容
					this.currentChapterContent = updatedHtml;

					// 提示用户保存成功
					uni.showToast({
						title: '编辑已保存',
						icon: 'success'
					});
				} catch (error) {
					console.error('保存编辑内容失败:', error);
					uni.showToast({
						title: '保存失败，请重试',
						icon: 'none'
					});
				}
			},
			updateChapterIndex(index) {
				if (index > 0 && index <= this.catalog.length) {
					// console.log(index)
					this.currentChapterIndex = index;
					if(index in this.chapterContentCache){
						this.currentChapterContent = this.chapterContentCache[index];
						this.initialContent =this.sanitizeHtml(this.chapterContentCache[index]) ;
						return ;
					}
					this.fetchChapterContent(); // 更新章节内容
				} else {
					uni.showToast({
						title: '已到达章节边界',
						icon: 'none'
					});
				}
			},
			sanitizeHtml(html) {
			    // 创建 DOMParser 实例
			    const parser = new DOMParser();
			    // 解析 HTML 字符串为文档对象
			    const doc = parser.parseFromString(html, 'text/html');
			    // 检查是否成功解析
			    if (!doc || !doc.head || !doc.body) {
			        console.error('无效的 HTML 内容');
			        return '';
			    }
			
			    // 规范化图片路径和修复 <img> 标签
			//     this.normalizeImages(doc);
			
			    // 提取 <body> 的内容
			    const bodyContent = doc.body.innerHTML || ''; // 如果 <body> 为空，则返回空字符串
			
			    // 构造最终结果
			    const result = `
			        <body>${bodyContent}</body>
			    `;
			
			    return result;
			},
			
			// 辅助方法：规范化图片路径和修复 <img> 标签
			normalizeImages(doc) {
			    // 遍历所有 <img> 标签
			    doc.querySelectorAll('img').forEach(img => {
			        // 获取当前图片的 src 属性
			        let src = img.getAttribute('src');
			
			        // 如果 src 为空或不存在，跳过处理
			        if (!src) {
			            console.warn('图片缺少 src 属性，已跳过:', img.outerHTML);
			            return;
			        }
			
			        // 去除多余空格
			        src = src.trim();
			
			        // 如果是相对路径，补充基础 URL
			        if (src.startsWith('/')) {
			            src = `${this.$store.state.BaseUrl}${src}`;
			        }
			
			        // 设置规范化的 src 属性
			        img.setAttribute('src', src);
			
			        // 添加 alt 属性（如果缺失）
			        if (!img.hasAttribute('alt')) {
			            img.setAttribute('alt', 'Default Alt Text');
			        }
			
			        this.wrapImageInParagraph(img,doc);
			    });
			},
			
			// 辅助方法：将 <img> 包裹在 <p> 中
			wrapImageInParagraph(img,doc) {
			    // 获取 <img> 的父节点
			    const parent = img.parentNode;
			
			    // 如果父节点已经是 <p>，无需处理
			    if (parent.tagName === 'P') {
			        return;
			    }
			
			    // 创建新的 <p> 元素
			    const newParagraph = doc.createElement('p');
			
			    // 将 <img> 移动到新的 <p> 中
			    parent.replaceChild(newParagraph, img); // 替换原位置的 img
			    newParagraph.appendChild(img); // 将 img 添加到新创建的 p 中
			},
			async fetchChapterContent() {
				try {
					const response = await this.$store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/book/read/${store.state.book.id}/page/${this.catalog[this.currentChapterIndex-1].href}`,
						method: "GET",
					});
					if (response.page_content) {
						this.currentChapterContent = response.page_content;
						this.initialContent =this.sanitizeHtml(response.page_content);
						this.chapterContentCache[this.currentChapterIndex] = response.page_content;
					}
				} catch (error) {
					uni.showToast({
						title: '获取章节失败',
						icon: 'none'
					})
					console.log(error);
				}
			},
			async uploadServer() {
				try {
					const chapterContent = this.currentChapterContent; // 章节 HTML 内容
					console.log(chapterContent);
					if (!chapterContent) {
						uni.showToast({
							title: '章节内容为空，请先编辑内容',
							icon: 'none'
						});
						return;
					}

					const bookId = this.book.id;
					const href = this.catalog[this.currentChapterIndex-1]?.href;

					if (!bookId || !href) {
						uni.showToast({
							title: '缺少 bookId 或 href，请检查数据',
							icon: 'none'
						});
						return;
					}

					// 提取并处理资源文件
					const resources = await this.extractResourcesFromHtml(chapterContent);

					// 将 HTML 内容转换为 Blob
					const htmlBlob = new Blob([chapterContent], {
						type: 'text/html'
					});

					// 创建 FormData 对象
					const formData = new FormData();
					formData.append('html', htmlBlob, 'chapter.html'); // 添加 HTML 文件
					formData.append('bookId', bookId); // 添加 bookId
					formData.append('href', href); // 添加 href

					// 添加资源文件到 FormData
					for (const [fileName, file] of Object.entries(resources)) {
						let prefixedFileName;
						if (fileName.startsWith('unknown_image') || fileName.endsWith('.jpg') || fileName.endsWith(
								'.png')) {
							prefixedFileName = `image_${fileName}`; // 图片资源前缀
						} else if (fileName.startsWith('unknown_video') || fileName.endsWith('.mp4') || fileName
							.endsWith('.webm')) {
							prefixedFileName = `video_${fileName}`; // 视频资源前缀
						} else {
							prefixedFileName = fileName; // 默认情况
						}
						formData.append(`${prefixedFileName}`, file); // 添加资源文件
						// formData.append(`resource_${fileName}`, file); // 添加资源文件
					}

					// 使用 fetch 发送 POST 请求
					const response = await fetch(`${this.$store.state.BaseUrl}/admin/updateBookChapter`, {
						method: 'POST',
						headers: {
							'Authorization': `Bearer ${this.$store.state.access_token}` // 如果需要携带 token
						},
						body: formData // 使用 FormData 作为请求体
					});

					if (response.ok) {
						const result = await response.json();
						if (result.message) {
							uni.showToast({
								title: '上传成功',
								icon: 'success'
							});
						} else {
							uni.showToast({
								title: '上传失败，请重试',
								icon: 'error'
							});
						}
					} else {
						uni.showToast({
							title: '上传失败，请检查网络或稍后重试',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('Error uploading chapter content:', error);
					uni.showToast({
						title: '上传失败，请检查网络或稍后重试',
						icon: 'none'
					});
				}
			},

			// 辅助方法：提取资源文件
			async extractResourcesFromHtml(html) {
				try {
					const parser = new DOMParser();
					const doc = parser.parseFromString(html, 'text/html');

					// 提取图片资源
					const images = Array.from(doc.querySelectorAll('img')).map(img => ({
						url: img.src,
						fileName: img.alt || 'unknown_image.jpg'
					}));

					// 提取视频资源
					const videos = Array.from(doc.querySelectorAll('video')).map(video => {
						const source = video.querySelector('source');
						return {
							url: source?.src || '',
							fileName: video.poster || 'unknown_video.mp4'
						};
					});

					// 合并资源
					const resources = [...images, ...videos];

					// 下载资源并转换为 File 对象
					const fileMap = {};
					for (const {
							url,
							fileName
						}
						of resources) {
						if (!url) continue; // 跳过无效的 URL
						if(url.includes('127.0.0.1')){continue;}
						console.log(url);
						const blob = await this.fetchResourceAsBlob(url); // 下载资源
						const file = new File([blob], fileName, {
							type: blob.type
						}); // 创建 File 对象
						fileMap[fileName] = file; // 使用文件名作为键存储到 fileMap 对象中
					}

					return fileMap; // 返回包含所有资源的映射表
				} catch (error) {
					console.error('Error extracting resources from HTML:', error);
					throw error;
				}
			},

			// 辅助方法：下载资源并返回 Blob
			async fetchResourceAsBlob(url) {
				const response = await fetch(url);
				if (!response.ok) {
					throw new Error(`Failed to fetch resource: ${url}`);
				}
				return await response.blob(); // 返回资源的 Blob 数据
			},
			async networkCatalog() {
				try {
					// 调用 Vuex 的 fetchData 方法
					const res = await this.$store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/book/contents/${store.state.book.id}`,
						method: "GET",

					});
					if (res.contents) {
						this.catalog = res.contents;
						console.log(this.catalog);
					} else {
						uni.showToast({
							title: '获取目录失败',
							icon: 'error'
						})
					}
				} catch (error) {
					console.error('Error fetching data:', error);
					uni.showToast({
						title: '获取目录失败，请重试',
						icon: 'none'
					});
				}
			}

		},
		onLoad() {
			this.networkCatalog().then(() => {
				if (this.catalog.length > 0) {
					this.currentChapterIndex = 1; // 默认显示第一章
					this.fetchChapterContent(); // 加载第一章内容
				} else {
					uni.showToast({
						title: '暂无章节内容',
						icon: 'none'
					});
				}
			});

		}
	};
</script>

<style lang="scss" scoped>
	.container {
		display: flex;
		justify-content: space-around;
		align-items: center;

		.left-content {
			width: 70vw;
			border: 5px solid #242424;
			box-shadow: 0 0 20px rgba(0, 0, 0, .2);
		}

		.right-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.phone-frame {
				width: 337.5px;
				/* 根据需要调整宽度 */
				height: 600px;
				/* 根据需要调整高度 */
				border: 12px solid #242424;
				border-radius: 15px;
				margin: 25px auto;
				padding-left: 30rpx;
				padding-right: 30rpx;
				position: relative;
				box-shadow: 0 0 20px rgba(0, 0, 0, .2);
			}

			.button-container {
				display: flex;
				justify-content: space-between;
				width: 100%;
			}
		}
	}
</style>