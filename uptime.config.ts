// This is a simplified example config file for quickstart
// Some not frequently used features are omitted/commented out here
// For a full-featured example, please refer to `uptime.config.full.ts`

// Don't edit this line
import { MaintenanceConfig, PageConfig, WorkerConfig } from './types/config'

const pageConfig: PageConfig = {
  // Title for your status page
  title: '服务状态 - weizwz',
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://www.weizwz.com/', label: '主页' },
    { link: 'https://note.weizwz.com/', label: '博客' },
    { link: 'https://github.com/weizwz', label: 'GitHub' },
  ],
  // favicon: '/favicon.ico',
  logo: '/logo.png',
  group: {
    基础服务: ['weiwz', 'blog', 'picture'],
    实用工具: ['nav', 'cover'],
    演示项目: ['fun_animation', 'charts'],
  },
}

const workerConfig: WorkerConfig = {
  // Define all your monitors here
  monitors: [
    // HTTP 监控示例
    // {
    //   // `id` 应该是唯一的，如果 `id` 保持不变，历史记录将被保留
    //   id: 'blog',
    //   // `name` 用于状态页面和回调消息
    //   name: '博客',
    //   // `method` 应该是有效的 HTTP 方法
    //   method: 'HEAD',
    //   // `target` 是一个有效的 URL
    //   target: 'https://blog.acofork.com/',
    //   // [可选] `tooltip` 仅用于在状态页面显示提示信息
    //   //tooltip: '这是此监控的提示信息',
    //   // [可选] `statusPageLink` 仅用于状态页面的可点击链接
    //   statusPageLink: 'https://blog.acofork.com/',
    //   // [可选] `hideLatencyChart` 如果设置为 true，将隐藏状态页面的延迟图表
    //   hideLatencyChart: false,
    //   // [可选] `expectedCodes` 是可接受的 HTTP 响应代码数组，如果不指定，默认为 2xx
    //   expectedCodes: [200],
    //   // [可选] `timeout` 以毫秒为单位，如果不指定，默认为 10000
    //   timeout: 10000,
    //   // [可选] 要发送的头部信息
    //   //headers: {
    //   //  'User-Agent': 'Uptimeflare',
    //   //  Authorization: 'Bearer YOUR_TOKEN_HERE',
    //   //},
    //   // [可选] 要发送的正文
    //   //body: 'Hello, world!',
    //   // [可选] 如果指定，响应必须包含关键字才被视为正常
    //   //responseKeyword: 'success',
    //   // [可选] 如果指定，响应必须不包含关键字才被视为正常
    //   //responseForbiddenKeyword: 'bad gateway',
    //   // [可选] 如果指定，检查将在您指定的区域运行，
    //   // 设置此值之前请参考文档 https://github.com/lyc8503/UptimeFlare/wiki/Geo-specific-checks-setup
    //   //checkLocationWorkerRoute: 'https://xxx.example.com',
    // },
    {
      id: 'weiwz',
      name: '主页',
      method: 'HEAD',
      target: 'https://weizwz.com/',
      statusPageLink: 'https://weizwz.com/',
      preview: 'https://p.weizwz.com/weizwz_home_fa1de45a5b1594a1.webp',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'blog',
      name: '博客',
      method: 'HEAD',
      target: 'https://note.weizwz.com/',
      statusPageLink: 'https://note.weizwz.com/',
      preview: 'https://p.weizwz.com/siteshot_note.webp',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'picture',
      name: '图床',
      method: 'HEAD',
      target: 'https://p.weizwz.com/favicon.ico',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'nav',
      name: '唯知导航',
      method: 'HEAD',
      target: 'https://nav.weizwz.com/',
      statusPageLink: 'https://nav.weizwz.com/',
      preview: 'https://p.weizwz.com/nav/20251120_110028_78c15d3713752f31.webp',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'cover',
      name: 'ThisCover',
      method: 'HEAD',
      target: 'https://cover.weizwz.com/',
      statusPageLink: 'https://cover.weizwz.com/',
      preview: 'https://p.weizwz.com/cover/cover.weizwz.com_8_5_b3d6c714f8bb59de.webp',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'fun_animation',
      name: 'FunAnimation',
      method: 'HEAD',
      target: 'https://animation.weizwz.com/',
      statusPageLink: 'https://animation.weizwz.com/',
      preview: 'https://p.weizwz.com/animation.weizwz.com_8_5_27b63074250acd5b.webp',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
    {
      id: 'charts',
      name: 'Vue3-Charts',
      method: 'HEAD',
      target: 'https://vue3-charts.weizwz.com/#/',
      statusPageLink: 'https://vue3-charts.weizwz.com/#/',
      preview: 'https://p.weizwz.com/vue3-charts.weizwz.com_8_5_ec7fa3cd203a193d.webp',
      hideLatencyChart: false,
      expectedCodes: [200],
      timeout: 10000,
    },
  ],
  notification: {
    // [Optional] Notification webhook settings, if not specified, no notification will be sent
    // More info at Wiki: https://github.com/lyc8503/UptimeFlare/wiki/Setup-notification
    webhook: {
      // [Required] webhook URL (example: Telegram Bot API)
      url: 'https://api.resend.com/emails',
      // [Optional] HTTP method, default to 'GET' for payloadType=param, 'POST' otherwise
      method: 'POST',
      // [Optional] headers to be sent
      headers: {
        Authorization: 'Bearer ${env.RESEND_API_KEY}',
        'Content-Type': 'application/json',
      },
      // [Required] Specify how to encode the payload
      // Should be one of 'param', 'json' or 'x-www-form-urlencoded'
      // 'param': append url-encoded payload to URL search parameters
      // 'json': POST json payload as body, set content-type header to 'application/json'
      // 'x-www-form-urlencoded': POST url-encoded payload as body, set content-type header to 'x-www-form-urlencoded'
      payloadType: 'json',
      // [Required] payload to be sent
      // $MSG will be replaced with the human-readable notification message
      payload: {
        from: '系统状态更新 <uptimeflare@updates.weizwz.com>',
        to: ['weizwz@foxmail.com'],
        subject: 'UptimeFlare 状态更新',
        text: '$MSG',
      },
      // [Optional] timeout calling this webhook, in millisecond, default to 5000
      timeout: 10000,
    },
    // [Optional] timezone used in notification messages, default to "Etc/GMT"
    timeZone: 'Asia/Shanghai',
    // [Optional] grace period in minutes before sending a notification
    // notification will be sent only if the monitor is down for N continuous checks after the initial failure
    // if not specified, notification will be sent immediately
    //gracePeriod: 5,
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 当任何监控的状态发生变化时，将调用此回调
      // 在这里编写任何 Typescript 代码
      // 注意：已在 webhook 中配置了 Resend 基础通知
      // 如果需要发送 HTML 邮件，请保留以下代码；如果只需简单文本通知，可以注释掉以下代码以避免重复通知。
      // 调用 Resend API 发送邮件通知 (高级 HTML 格式)
      // 务必在 Cloudflare Worker 的设置 -> 变量中配置: RESEND_API_KEY
      /* 
      if (env.RESEND_API_KEY) {
        try {
          const statusText = isUp ? '恢复正常 (UP)' : '服务中断 (DOWN)';
          const color = isUp ? '#4ade80' : '#ef4444'; // green-400 : red-500
          const subject = `[${statusText}] ${monitor.name} 状态变更通知`;
          
          // 尝试格式化时间
          let timeString = new Date(timeNow * 1000).toISOString();
          try {
            timeString = new Date(timeNow * 1000).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
          } catch (e) { }

          const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
              <h2 style="color: ${color};">${statusText}</h2>
              <p><strong>监控名称:</strong> ${monitor.name}</p>
              <p><strong>时间:</strong> ${timeString}</p>
              <p><strong>原因:</strong> ${reason}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="font-size: 12px; color: #888;">来自 UptimeFlare 监控报警</p>
            </div>
          `;

          const resendPayload = {
            from: "系统状态更新 <uptimeflare@update.2x.nz>",
            to: ["acofork@foxmail.com"],
            subject: subject,
            html: htmlContent,
          };

          const resp = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(resendPayload)
          });

          if (!resp.ok) {
            console.error(`Resend API call failed: ${resp.status} ${await resp.text()}`);
          }
        } catch (e) {
          console.error(`Error calling Resend API: ${e}`);
        }
      }
      */
      // 这不会遵循宽限期设置，并且在状态变化时立即调用
      // 如果您想实现宽限期，需要手动处理
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 如果任何监控有正在进行的事件，此回调将每分钟调用一次
      // 在这里编写任何 Typescript 代码
    },
  },
}

// You can define multiple maintenances here
// During maintenance, an alert will be shown at status page
// Also, related downtime notifications will be skipped (if any)
// Of course, you can leave it empty if you don't need this feature

const maintenances: MaintenanceConfig[] = []

// const maintenances: MaintenanceConfig[] = [
//   {
// // [Optional] Monitor IDs to be affected by this maintenance
// monitors: ['foo_monitor', 'bar_monitor'],
// // [Optional] default to "Scheduled Maintenance" if not specified
// title: 'Test Maintenance',
// // Description of the maintenance, will be shown at status page
// body: 'This is a test maintenance, server software upgrade',
// // Start time of the maintenance, in UNIX timestamp or ISO 8601 format
// start: '2020-01-01T00:00:00+08:00',
// // [Optional] end time of the maintenance, in UNIX timestamp or ISO 8601 format
// // if not specified, the maintenance will be considered as on-going
// end: '2050-01-01T00:00:00+08:00',
// // [Optional] color of the maintenance alert at status page, default to "yellow"
// color: 'blue',
//   },
// ]

// Don't edit this line
export { maintenances, pageConfig, workerConfig }
