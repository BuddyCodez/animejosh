import axios from "axios";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

// create a user context.
interface userContextType {
    user: string;
    setUser: (user: string) => void;
    uid: string;
    setUid: (uid: string) => void;
}
const userContext = createContext<userContextType | null>(null);
const UserProvider = ({ children }: { children: any }) => {
    const [uid, setUid] = useState<string>("");
    const [user, setUser] = useState<any>({
        name: "",
        email: "",
        image: ""
    });
    const { data: session } = useSession();
    const fetchUser = async () => {
        const { data } = await axios.post("/api/user/find", {
            email: session?.user?.email,
        });
        return data || false;
    };
    const createUser = async () => {
        const { data } = await axios.post("/api/user/create", {
            email: session?.user?.email,
            name: session?.user?.name,
            image: session?.user?.image,
        });
        return data || false;
    };
    useEffect(() => {
        if (session?.user) {
            setUser(session.user);
            fetchUser().then(x => {
                const userId = String(x.userId);
                if (!userId || userId == "null") {
                    createUser().then((r) => {
                        fetchUser().then(x => setUid(String(x.userId)));
                    });
                } else {
                    setUid(userId);
                }
            })
        }
    }, [session])
    return (
        <userContext.Provider value={{ user, setUser, uid, setUid }}>
            {children}
        </userContext.Provider>
    )
}
const useUserContext = () => useContext(userContext);
export { useUserContext, UserProvider };
export type { userContextType };