import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      {/* Tailwind CSS 是一个实用优先的 CSS 框架，开发者需要频繁使用多个类名组合。在 React 中，动态生成类名时常用模板字符串或工具库（如 clsx、classnames）。 */}
      <GlobeAltIcon className="h-12 w-12 rotate-[15deg]" />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
