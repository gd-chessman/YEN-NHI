import React from 'react'

export default function Matching() {
    const items1 = [
    ];

    const items2 = [
    ];

    // Function to split items2 into two equal columns
    const splitItemsIntoTwoColumns = (items) => {
        const halfLength = Math.ceil(items.length / 2);
        const firstHalf = items.slice(0, halfLength);
        const secondHalf = items.slice(halfLength);
        return [firstHalf, secondHalf];
    };

    // Get the two columns for items2 (only used when items2 has more than 5 items)
    const [items2Column1, items2Column2] = splitItemsIntoTwoColumns(items2);
    
    // Determine if we should use 3 columns layout (when items2 has more than 5 items)
    const useThreeColumnsLayout = items2.length > 5;

    return (
        <>
            <header className="w-full fixed z-50 top-0 h-[4.8125rem] bg-[#ededff] shadow-[0px_10px_60px_0px_rgba(0,0,0,0.15)]" />
            <main className='bg-[#ededff] h-svh mt-16 py-16'>
                <div className="w-11/12 relative flex items-center h-8 px-3 py-2 bg-[#e0e0fe] rounded-3xl mx-auto  text-center font-semibold ">
                    <div className='absolute left-1/3 bg-[#c4b5fd] text-white rounded-full size-12 flex items-center justify-center'>5</div>
                    <div className='absolute left-2/3 bg-[#c4b5fd] text-white rounded-full size-12 flex items-center justify-center'>10</div>
                    <div className='absolute right-0 bg-[#c4b5fd] text-white rounded-full size-12 flex items-center justify-center'>15</div>
                </div>
                
                {/* Either 2 or 3 columns depending on the number of items2 */}
                <div className={`grid ${useThreeColumnsLayout ? 'grid-cols-3' : 'grid-cols-2'} gap-4 w-11/12 mx-auto mt-12`}>
                    {/* Column 1 - English items (always shown) */}
                    <div className='flex flex-col gap-4'>
                        {items1.map((item, index) => (
                            <div key={item.id} className='flex gap-2'>
                                <span className="w-20 h-16 flex items-center bg-indigo-100 rounded-2xl shadow-[0px_3px_0px_0px_rgba(186,190,253,1.00)] border-2 border-violet-300 text-center justify-center text-violet-300 text-3xl font-bold">
                                    {index + 1}
                                </span>
                                <div className="w-full flex items-center px-4 h-16 bg-indigo-100 rounded-2xl shadow-md border-2 border-violet-300">
                                    {item.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* If using 2 columns layout (items2 <= 5) */}
                    {!useThreeColumnsLayout && (
                        <div className='flex flex-col gap-4'>
                            {items2.map((item, index) => (
                                <div key={item.id} className='flex gap-2'>
                                    <span className="w-20 h-16 flex items-center bg-indigo-100 rounded-2xl shadow-[0px_3px_0px_0px_rgba(186,190,253,1.00)] border-2 border-violet-300 text-center justify-center text-violet-300 text-3xl font-bold">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <div className="w-full flex items-center px-4 h-16 bg-indigo-100 rounded-2xl shadow-md border-2 border-violet-300">
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* If using 3 columns layout (items2 > 5) */}
                    {useThreeColumnsLayout && (
                        <>
                            {/* Column 2 - First half of Vietnamese items */}
                            <div className='flex flex-col gap-4'>
                                {items2Column1.map((item, index) => (
                                    <div key={item.id} className='flex gap-2'>
                                        <span className="w-16 h-16 flex items-center bg-indigo-100 rounded-2xl shadow-[0px_3px_0px_0px_rgba(186,190,253,1.00)] border-2 border-violet-300 text-center justify-center text-violet-300 text-3xl font-bold">
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        <div className="w-full flex items-center px-4 h-16 bg-indigo-100 rounded-2xl shadow-md border-2 border-violet-300">
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Column 3 - Second half of Vietnamese items */}
                            <div className='flex flex-col gap-4'>
                                {items2Column2.map((item, index) => (
                                    <div key={item.id} className='flex gap-2'>
                                        <span className="w-16 h-16 flex items-center bg-indigo-100 rounded-2xl shadow-[0px_3px_0px_0px_rgba(186,190,253,1.00)] border-2 border-violet-300 text-center justify-center text-violet-300 text-3xl font-bold">
                                            {String.fromCharCode(65 + index + items2Column1.length)}
                                        </span>
                                        <div className="w-full flex items-center px-4 h-16 bg-indigo-100 rounded-2xl shadow-md border-2 border-violet-300">
                                            {item.text}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className='w-11/12 mx-auto mt-8 flex'>
                    <button className='bg-[#0e22e9] border-none text-white font-semibold py-2 px-4 rounded-lg block ml-auto'>Check</button>
                </div>
            </main>
        </>
    );
}