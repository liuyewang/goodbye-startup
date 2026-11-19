const en = {
  choose: "Choose a simulation",
  startup: "Startup simulation",
  life: "Silicon Valley Life",
  title: "Silicon Valley Life Reboot",
  description:
    "Explore career, life, health and financial trade-offs in Dean Chen’s original Silicon Valley game. The original game is primarily in Chinese.",
  boundary:
    "External experience, separate from the 180-day startup simulation. Fictional career, investment and immigration scenarios are not professional advice.",
  privacy:
    "Loading connects directly to deanchen.me. The original site controls its own code and storage; browser privacy settings may affect its saves. We do not transfer your startup idea, decisions, save or free eligibility to it. It does not use our DeepSeek quota.",
  load: "Load original game",
  close: "Close external game",
  leave:
    "Switching modules or closing the game unloads it. Unsaved progress may be lost; this site cannot recover or manage its save.",
  open: "Open original in a new tab",
  source: "Source code · MIT",
  author: "Original by Dean Chen",
  frame: "Original Silicon Valley Life Reboot game (Chinese)",
  fallback:
    "If the game is blank, slow or unable to save here, open the original in a new tab. The frame loading does not prove the game is ready.",
  teaser: "Another kind of simulation",
  explore: "Explore Silicon Valley Life",
};
type Copy = Record<keyof typeof en, string>;
const zh: Copy = {
  choose: "选择模拟模块",
  startup: "创业模拟",
  life: "硅谷人生",
  title: "硅谷人生重开模拟器",
  description:
    "体验 Dean Chen 原作中的职业、生活、健康与财务取舍。原版内容以中文为主。",
  boundary:
    "这是独立的外部体验，与 180 天创业模拟分开。虚构的职业、投资和移民情节不构成专业建议。",
  privacy:
    "加载后浏览器会直接连接 deanchen.me。原站管理自己的代码和存储，浏览器隐私设置可能影响其存档。我们不会向它传递你的创业想法、决策、存档或免费资格，也不占用本站 DeepSeek 额度。",
  load: "加载原版游戏",
  close: "关闭外部游戏",
  leave:
    "切换模块或关闭游戏会卸载它，未保存的进度可能丢失；本站无法恢复或管理原站存档。",
  open: "在新标签页打开原版",
  source: "源码 · MIT 许可",
  author: "原作者：Dean Chen",
  frame: "原版硅谷人生重开模拟器（中文）",
  fallback:
    "若游戏空白、加载慢或无法存档，请在新标签页打开原版。框架加载完成不代表游戏已就绪。",
  teaser: "体验另一种模拟",
  explore: "探索硅谷人生",
};
export const lifeCopy = { en, zh };
export const LIFE_URL = "https://deanchen.me/sv-life-reboot/";
export const LIFE_SOURCE = "https://github.com/DeanChensj/sv-life-reboot";
