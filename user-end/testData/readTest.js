export const testRead = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>小说文本预览</title>
<style>
    body {
        font-family: "Songti SC", serif;
        line-height: 1.6;
        margin: 0 auto;
        width: 80%;
        max-width: 800px;
    }
    h1, h2 {
        text-align: center;
    }
    .chapter {
        page-break-before: always;
        margin-top: 4em;
    }
    .dropcap {
        float: left;
        font-size: 3em;
        line-height: 0.7em;
        margin: 0 0.1em 0.1em 0;
    }
</style>
</head>
<body>

<h1>风之谷的秘密</h1>

<div class="chapter">
    <h2>第一章：相遇</h2>
    <p><span class="dropcap">许</span>多年前，在遥远的风之谷，有一个传说...</p>
    <p>那是一片被遗忘的土地，四周环绕着高耸入云的山脉，只有勇敢者才敢踏入。我们的故事开始于一个普通的日子里，当太阳刚刚升起，照亮了这片神秘的地方。</p>
</div>

<div class="chapter">
    <h2>第二章：旅程</h2>
    <p>经过几天的跋涉，主角终于来到了传说中的古城遗址。这里的一切都显得那么古老而神秘，仿佛时间在这里停下了脚步。</p>
    <p>在探索的过程中，他发现了一本破旧的日记，上面记载着关于风之谷不为人知的秘密。</p>
</div>

<div class="chapter">
    <h2>第三章：真相</h2>
    <p>随着调查的深入，主角逐渐揭开了隐藏在历史背后的真相。原来，风之谷曾经是文明的摇篮，但因为一场突如其来的灾难而被遗弃。</p>
    <p>现在，他面临着选择：<strong>是否要揭示这个秘密</strong>，还是让它继续沉睡在这片土地之下。</p>
</div>

<p style="text-align: center;">—— 完 ——</p>

</body>
</html>
`;