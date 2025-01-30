"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce"; // 去抖动的包

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams(); // 获取当前 URL 的查询参数（?query=something）
  const pathname = usePathname(); // 获取当前路径（不含查询参数）。
  const { replace } = useRouter(); // 用于导航，replace 方法可以替换当前 URL

  // handleSearch 是一个防抖函数，当用户输入时，它会等待 300 毫秒再执行搜索逻辑
  const handleSearch = useDebouncedCallback((term) => {
    // ↓useSearchParams() 获取的是 不可变（immutable）的查询参数对象，所以不能直接修改它。所以用 new URLSearchParams(searchParams) 创建一个 可修改 的副本。
    const params = new URLSearchParams(searchParams); // URLSearchParams 是 JavaScript 内置的 Web API，用于操作 URL 查询参数（?key=value 部分）。
    params.set("page", "1"); // 搜索后，重置到第 1 页
    if (term) {
      params.set("query", term); // 如果用户输入了内容，它会更新 URL 的 query 参数
    } else {
      params.delete("query"); // 如果输入框为空，则移除 query 参数
    }
    replace(`${pathname}?${params.toString()}`); // 通过 replace 方法更新浏览器的 URL。
  }, 300);
  
  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder} //输入框的 placeholder 属性由外部传入
        // ↓当用户输入内容时，onChange 事件会触发 handleSearch 函数
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()} // 反过来，输入框的默认值（defaultValue）从 URL 的 query 参数中获取
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
