'use client';

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUsers";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useMemo, useState  } from "react";
import { CgChevronLeftR } from "react-icons/cg";
import { FiMoreHorizontal } from "react-icons/fi";
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";

interface HeaderProps {
    conversation: Conversation & {
      users: User[]
    }
  }
  
const Header:React.FC<HeaderProps> = ({conversation}) => {

    const otherUser = useOtherUser(conversation);

    const [drawerOpen, setDrawerOpen] = useState(false);

    const statusText = useMemo(() => {
        if (conversation.isGroup) {
          return `${conversation.users.length} members`;
        }
    
        return 'Active';
      }, [conversation]);

    return (
      <>
        <ProfileDrawer 
        data={conversation} 
        isOpen={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        />
        <div className="bg-white 
            w-full 
            flex 
            border-b-[1px] 
            sm:px-4 
            py-3 
            px-4 
            lg:px-6 
            justify-between 
            items-center 
            shadow-sm">
            <div className="flex gap-3 items-center">
                <Link href='/conversations'
                    className="
                    lg:hidden 
                    block 
                    text-slate-400 
                    hover:text-cyan-600 
                    transition 
                    cursor-pointer">
                        <CgChevronLeftR size={30}/>
                </Link>
                {conversation.isGroup ? (
                    <AvatarGroup users={conversation.users} />
                    ) : (
                    <Avatar user={otherUser} />
                    )}
                <div className="flex flex-col">
                  <div>
                    {conversation.name || otherUser.name}
                  </div>
                  <div className="text-sm font-light text-zinc-500">
                      {statusText}
                  </div>
                </div>
            </div>
            <FiMoreHorizontal 
                    size={32}
                    onClick={() => setDrawerOpen(true)}
                    className="
                      text-slate-400
                      cursor-pointer
                      hover:text-cyan-600
                      transition"
              />
        </div>
      </>
  )
}

export default Header;
