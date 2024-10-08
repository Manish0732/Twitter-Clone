import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios';
import toast from 'react-hot-toast';

const useUpdateProfile = () => {

    const queryClient = useQueryClient();

    const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useMutation({
        mutationFn: async (formData) => {
            try {
                const res = await axios.post('/api/users/update', formData)
                return res.data;
            } catch (error) {
                throw new Error(error.response.data.error || "Something Went wrong")
            }
        },
        onSuccess: () => {
            toast.success("Profile Updated Successfully");
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["authUser"] }),
                queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
            ])
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return { updateProfile, isUpdatingProfile };
}

export default useUpdateProfile
