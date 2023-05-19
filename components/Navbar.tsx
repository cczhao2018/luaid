import { IconExternalLink } from "@tabler/icons-react";
import { FC } from "react";
import { BrandTiktok, BrandWechat, BrandYoutube } from "tabler-icons-react";

export const Navbar: FC = () => {
  return (
    <div className="flex h-[60px] border-b border-gray-300 py-2 px-8 items-center justify-between">
      <div className="font-bold text-2xl flex items-center">
        <a
          className="hover:opacity-50"
          href="https://paul-graham-gpt.vercel.app"
        >
          LuAid
        </a>
      </div>
      {/* <div>
        <a
          className="flex items-center hover:opacity-50"
          href="http://www.paulgraham.com/articles.html"
          target="_blank"
          rel="noreferrer"
        >
          <div className="hidden sm:flex">PaulGraham.com</div>

          <IconExternalLink className="ml-1" size={20} />
        </a>
      </div> */}
      <div className="flex space-x-4">
        <a
          className="flex items-center hover:opacity-50"
          href="https://v.douyin.com/UFkRAQS/"
          target="_blank"
          rel="noreferrer"
        >
          <BrandTiktok size={24} />
        </a>

        <a
          className="flex items-center hover:opacity-50"
          href="/contact"
          target="_blank"
          rel="noreferrer"
        >
          <BrandYoutube size={24} />
        </a>

        <a
          className="flex items-center hover:opacity-50"
          href="/contact"
          target="_blank"
          rel="noreferrer"
        >
          <BrandWechat size={24} />
        </a>
      </div>
    </div>
  );
};
