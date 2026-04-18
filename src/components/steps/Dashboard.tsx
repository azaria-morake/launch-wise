"use client";

import { useWizardStore } from "@/store/wizardStore";

export default function Dashboard() {
  const { data } = useWizardStore();

  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto py-8">
      <div className="text-center space-y-6">
        {data.logoUrl && (
          <div className="w-32 h-32 mx-auto bg-white p-2 rounded-3xl shadow-md border border-gray-100 flex items-center justify-center overflow-hidden">
             <img src={data.logoUrl} alt="Logo" className="w-full h-full object-contain" />
          </div>
        )}
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
          {data.businessName || "Your Business"}
        </h1>
        <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
          {data.businessIdea}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
           <h3 className="font-semibold text-gray-400 text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Details
           </h3>
           <div className="space-y-4">
             <p className="text-gray-900 font-medium text-lg flex items-center gap-3">
               <span className="text-2xl">📍</span> {data.location}
             </p>
             <p className="text-gray-900 font-medium text-lg flex items-center gap-3">
               <span className="text-2xl">📈</span> {data.stage}
             </p>
           </div>
        </div>
        
        <div className="bg-indigo-50 p-8 rounded-3xl shadow-sm border border-indigo-100 hover:shadow-md transition-shadow">
           <h3 className="font-semibold text-indigo-400 text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Brand Voice
           </h3>
           <p className="text-indigo-900 font-medium leading-relaxed text-lg">{data.marketingTone}</p>
        </div>

        {data.businessPlan && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
             <h3 className="font-semibold text-gray-400 text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Business Plan
             </h3>
             <div className="prose max-w-none text-gray-700">
               <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{data.businessPlan}</pre>
             </div>
          </div>
        )}

        {data.registrationAdvice && (
          <div className="bg-amber-50 p-8 rounded-3xl shadow-sm border border-amber-200 md:col-span-2">
             <h3 className="font-semibold text-amber-600 text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-500"></span> Legal Recommendations
             </h3>
             <pre className="whitespace-pre-wrap font-sans text-amber-900 text-sm leading-relaxed">{data.registrationAdvice}</pre>
          </div>
        )}

        {data.socialPosts && data.socialPosts.length > 0 && (
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 md:col-span-2">
             <h3 className="font-semibold text-gray-400 text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Ready-to-use Marketing
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {data.socialPosts.map((post: string, i: number) => (
                 <div key={i} className="bg-gray-50 p-6 border border-gray-200 rounded-2xl text-sm text-gray-800 whitespace-pre-wrap shadow-sm">
                   {post}
                 </div>
               ))}
             </div>
          </div>
        )}

        {data.socialImageUrl && (
          <div className="bg-gray-900 p-8 rounded-3xl shadow-lg border border-gray-800 md:col-span-2 flex flex-col items-center">
             <h3 className="font-semibold text-gray-400 text-sm tracking-widest uppercase mb-6 w-full text-left">
               Promo Material
             </h3>
             <img src={data.socialImageUrl} alt="Promo" className="w-full md:w-3/4 rounded-2xl mx-auto shadow-2xl ring-4 ring-white/10" />
          </div>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={() => {
            alert("This is the end of the MVP wizard! Good luck with Launch Wise!");
          }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-bold shadow-xl hover:shadow-indigo-500/30 transition-all text-lg scale-100 hover:scale-105 active:scale-95"
        >
          Launch My Business 🚀
        </button>
      </div>
    </div>
  );
}
