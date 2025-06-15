import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/engineer');
}


// export default function Home() {
//   const [selected, setSelected] = useState<null | 'engineer' | 'model'>(null);

//   return (
//     <main className="h-screen w-screen flex overflow-hidden bg-white">
//       {!selected && (
//         <>
//           <motion.div
//             className="w-1/2 h-full flex items-center justify-center bg-blue-200 hover:bg-blue-300 cursor-pointer"
//             onClick={() => setSelected('engineer')}
//             whileHover={{ scale: 1.05 }}
//           >
//             <h1 className="text-4xl font-bold">Software Engineer</h1>
//           </motion.div>
//           <motion.div
//             className="w-1/2 h-full flex items-center justify-center bg-orange-200 hover:bg-orange-300 cursor-pointer"
//             onClick={() => setSelected('model')}
//             whileHover={{ scale: 1.05 }}
//           >
//             <h1 className="text-4xl font-bold">Model</h1>
//           </motion.div>
//         </>
//       )}
//       {selected === 'engineer' && (
//         <motion.div
//           initial={{ x: 0 }}
//           animate={{ x: '-50%' }}
//           transition={{ duration: 0.8 }}
//           className="w-full h-full bg-white p-10"
//         >
//           <h2 className="text-3xl">Welcome to the Engineer Side 🚀</h2>
//           {/* Add more engineer components here */}
//         </motion.div>
//       )}
//       {selected === 'model' && (
//         <motion.div
//           initial={{ x: 0 }}
//           animate={{ x: '50%' }}
//           transition={{ duration: 0.8 }}
//           className="w-full h-full bg-orange-50 p-10"
//         >
//           <h2 className="text-3xl">Welcome to the Model Side 📸</h2>
//           {/* Add more model components here */}
//         </motion.div>
//       )}
//     </main>
//   );
// }
