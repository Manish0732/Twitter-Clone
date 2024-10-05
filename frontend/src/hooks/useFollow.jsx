import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";


const useFollow = () => {

    const queryClient = useQueryClient();

    const { mutate: follow, isPending, } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await axios.post(`/api/users/follow/${userId}`);
                return res.data;
            } catch (error) {
                throw new Error(error.response.data.error || error)
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
            ])
        },
        onError: (error) => { toast.error(error.message || "Something Went Wrong") }
    })
    return { follow, isPending };
}

export default useFollow;