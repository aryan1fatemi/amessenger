import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { HiChatAlt2 } from 'react-icons/hi'
import { BiLogOut } from 'react-icons/bi'
import { HiUserGroup} from 'react-icons/hi2'
import { signOut } from "next-auth/react";
import useConversation from "./useConversations";

const useRoutes= ()=>{
    const pathname = usePathname();
    const { conversationId } = useConversation();
    const routes = useMemo(()=> [
        {
            label: 'Chat',
            href: '/conversations',
            icon: HiChatAlt2,
            active: pathname === '/conversations' || !!conversationId 
        },
        {
            label: 'Users',
            href: '/users',
            icon: HiUserGroup,
            active: pathname === '/users'    
        },
        {
            label: 'Logout',
            onClick: ()=> signOut(),
            href: '#',
            icon: BiLogOut,
  
        }
    ],[pathname, conversationId])

    return routes;

}
export default useRoutes;