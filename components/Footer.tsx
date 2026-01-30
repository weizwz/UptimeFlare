import { pageConfig } from '@/uptime.config'

export default function Footer() {
  const links = pageConfig.links || []

  return (
    <footer className="py-6 mt-16 text-center text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Credits */}
        <div className="font-bold flex justify-center items-center gap-6 text-xs opacity-80">
          <p>
            &copy; {new Date().getFullYear()}{' '}
            <span className="font-medium">
              Services Status by &nbsp;
              <a
                href="https://github.com/weizwz"
                target="_blank"
                className="font-bold hover:text-emerald-500 transition-colors"
              >
                weizwz
              </a>
            </span>
          </p>
          <div className="flex items-center gap-1">
            <span className="font-medium">本站使用</span>
            <a
              href="https://github.com/weizwz/UptimeFlare"
              target="_blank"
              className="hover:text-emerald-500 transition-colors"
            >
              UptimeFlare
            </a>
          </div>
          {pageConfig.customFooter && (
            <div
              dangerouslySetInnerHTML={{ __html: pageConfig.customFooter }}
              className="mt-2 text-xs opacity-70"
            />
          )}
        </div>
      </div>
    </footer>
  )
}
