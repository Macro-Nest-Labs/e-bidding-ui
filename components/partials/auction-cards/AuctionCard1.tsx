// import React, { useEffect, useState } from 'react';

// import { NEXT_PUBLIC_ARG_BE_URL } from '@/constants';
// import useSocket from '@/hooks/useSocket';
// import { IListingModel } from '@/utils/types/be-model-types';
// import { TJoinedRoomData } from '@/utils/types/socket-types';
// import Typography from '@mui/material/Typography';
// import toast from 'react-hot-toast';

// type AuctionCarg1Prop = {
//   auctionId: string;
//   roomId: string;
//   auctionData: IListingModel;
// };

// const AuctionCard1: React.FC<AuctionCarg1Prop> = ({
//   auctionId,
//   roomId,
//   auctionData,
// }) => {
//   const socket = useSocket(NEXT_PUBLIC_ARG_BE_URL, '/auction');

//   const [extendedEndTime, setExtendedEndTime] = useState<Date | null>(null);
//   const [timeRemaining, setTimeRemaining] = useState('');
//   const [winningBidder, setWinningBidder] = useState(null);

//   // TODO: Extract this into a helper function
//   const calculateTimeRemaining = (
//     startTime: string,
//     duration: string,
//     extendedEndTime?: Date,
//   ) => {
//     const startTimeMs = new Date(startTime).getTime();
//     const [hours, minutes] = duration.split(':').map(Number);
//     const durationMs = (hours * 60 * 60 + minutes * 60) * 1000;
//     const originalEndTime = startTimeMs + durationMs;
//     const endTime = extendedEndTime
//       ? new Date(extendedEndTime).getTime()
//       : originalEndTime;

//     const now = new Date().getTime();
//     const timeLeft = endTime - now;

//     if (timeLeft < 0) {
//       return '00 : 00 : 00'; // Auction has ended
//     }

//     let remainingHours: string | number = Math.floor(
//       (timeLeft / (1000 * 60 * 60)) % 24,
//     );
//     let remainingMinutes: string | number = Math.floor(
//       (timeLeft / 1000 / 60) % 60,
//     );
//     let remainingSeconds: string | number = Math.floor((timeLeft / 1000) % 60);

//     remainingHours =
//       remainingHours < 10 ? `0${remainingHours}` : `${remainingHours}`;
//     remainingMinutes =
//       remainingMinutes < 10 ? `0${remainingMinutes}` : `${remainingMinutes}`;
//     remainingSeconds =
//       remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

//     return `${remainingHours} : ${remainingMinutes} : ${remainingSeconds}`;
//   };

//   // useEffect(() => {
//   //   const interval = setInterval(() => {
//   //     setTimeRemaining(
//   //       calculateTimeRemaining(
//   //         auctionData.startTime,
//   //         auctionData.duration,
//   //         auctionData.extendedEndDate
//   //           ? auctionData.extendedEndDate
//   //           : extendedEndTime
//   //           ? extendedEndTime
//   //           : undefined,
//   //       ),
//   //     );
//   //   }, 1000);

//     return () => clearInterval(interval);
//   }, [auctionData, extendedEndTime]);

//   useEffect(() => {
//     if (socket) {
//       const handleAuctionExtended = (newEndTime: Date) => {
//         // console.log('Auction extended to:', newEndTime);
//         setExtendedEndTime(newEndTime);
//       };

//       const handleJoinedRoom = async (roomId: TJoinedRoomData) => {
//         toast.success(`Joined room: ${roomId}`);
//       };

//       socket.on('auction-extended', handleAuctionExtended);
//       socket.on('joined-room', handleJoinedRoom);

//       return () => {
//         if (socket) {
//           socket.off('auction-extended', handleAuctionExtended);
//           socket.off('joined-room', handleJoinedRoom);
//         }
//       };
//     }
//   }, [socket]);

//   useEffect(() => {
//     if (socket) {
//       const supplierId = localStorage.getItem('supplierId');
//       const buyerId = localStorage.getItem('buyerId');
//       if (supplierId) {
//         socket.emit('join-room', roomId, supplierId);
//       } else if (buyerId) {
//         socket.emit('join-room', roomId, buyerId, true);
//       }
//     }
//   }, [roomId, socket]);

//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 bg-white shadow-lg rounded-sm border border-slate-200 my-4">
//       <header className="px-5 py-4 border-b border-slate-100 flex justify-between flex-col sm:flex-row text-lg">
//         <h2 className="font-semibold text-slate-800 ">
//           Auction Name : {auctionId ?? '-'}{' '}
//         </h2>
//         <div>
//           <h2 className="font-semibold text-slate-800  inline-block">
//             Rank : 1
//           </h2>
//         </div>
//         <div>
//           <h2 className="font-semibold text-slate-800  inline-block">
//             Time Remaining :
//           </h2>
//           <span className="font-semibold text-slate-800 ">{timeRemaining}</span>
//         </div>
//       </header>

//       <div className="p-3">
//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="table-auto w-full">
//             {/* Table header */}
//             <thead className="text-base uppercase text-slate-400  bg-slate-50 rounded-sm">
//               <tr>
//                 <th className="p-2">
//                   <div className="font-semibold text-left">Name</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Category</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Project Owner</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">Status</div>
//                 </th>
//                 <th className="p-2">
//                   <div className="font-semibold text-center">
//                     Type of Lisiting
//                   </div>
//                 </th>
//               </tr>
//             </thead>
//             {/* Table body */}
//             <tbody className="text-md font-medium divide-y divide-slate-100">
//               {auctionData ? (
//                 auctionData.lots.map((lot, index) => (
//                   <tr key={index}>
//                     {/* Name Column */}
//                     <td className="p-2">
//                       <div className="text-left">{auctionData.name}</div>
//                     </td>

//                     {/* Category Column */}
//                     <td className="p-2">
//                       <div className="text-center">{lot.category.name}</div>
//                     </td>

//                     {/* Project Owner Column */}
//                     <td className="p-2">
//                       <div className="text-center">
//                         {auctionData.projectOwner}
//                       </div>
//                     </td>

//                     {/* Status Column */}
//                     <td className="p-2">
//                       <div className="text-center">{auctionData.status}</div>
//                     </td>

//                     {/* Type of Listing Column */}
//                     <td className="p-2">
//                       <div className="text-center">
//                         {auctionData.typesOfListing}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 // Fallback UI when auctionData is undefined
//                 <tr>
//                   <td className="p-2 text-center">
//                     No auction data available.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <div className="overflow-x-auto mt-4">
//           <table className="table-auto w-full">
//             {/* Table header */}
//             <thead className=" text-slate-400  bg-slate-50 rounded-sm">
//               <tr>
//                 <th className="p-2 grid grid-cols-1 gap-2 sm:grid-cols-2 items-center">
//                   <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 items-center">
//                     <div>
//                       <div className="flex items-center justify-center lg:justify-start gap-2">
//                         <Typography
//                           className="font-[600] text-left text-slate-400"
//                           gutterBottom
//                         >
//                           Winning Bidder:
//                           {winningBidder ? (
//                             <span className="ml-1 font-medium text-black">
//                               {winningBidder}
//                             </span>
//                           ) : (
//                             <span className="ml-1 font-medium text-black">
//                               {'Auction is yet to conclude'}
//                             </span>
//                           )}
//                         </Typography>
//                       </div>
//                     </div>
//                     <div className="flex items-center justify-center gap-2">
//                       <Typography
//                         className="font-semibold text-left"
//                         gutterBottom
//                       >
//                         Bid Value:
//                         {winningBidder ? (
//                           <span className="ml-1 font-medium text-black before:content-['₹']">
//                             {winningBidder}
//                           </span>
//                         ) : (
//                           <span className="ml-1 font-medium text-black">
//                             {'Auction is yet to conclude'}
//                           </span>
//                         )}
//                       </Typography>
//                     </div>
//                   </div>
//                   {/* <div>
//                     <div className="flex justify-end">
//                       <button className="w-full sm:w-full md:1/2 middle none center rounded-lg bg-blue-500 py-1 px-4 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
//                         Submit Current Lot
//                       </button>
//                     </div>
//                   </div> */}
//                 </th>
//               </tr>
//             </thead>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuctionCard1;
