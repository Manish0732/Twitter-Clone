import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import useFollow from "../../hooks/useFollow";

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import LoadingSpinner from "./LoadingSpinner";


const RightPanel = () => {

	const { data: suggestedUsers, isLoading, } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			try {
				const res = await axios.get('/api/users/suggested')
				return res.data;
			} catch (error) {
				throw new Error(error.response.data.error || error)
			}
		}
	})

	const { follow, isPending } = useFollow();

	if (suggestedUsers?.length === 0) return <div className='md:w-64 w-0'></div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUsers?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileimg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-slate-300 hover:bg-slate-50 text-black border-none rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											follow(user._id);
										}}
									>
										{isPending ? <LoadingSpinner size='sm' /> : "Follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div >
	);
};
export default RightPanel;