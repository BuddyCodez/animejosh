import React from 'react'

const Loading = () => {
    return (
        <div className='w-full h-full'>
            <div className="flex flex-col items-center justify-center h-screen">
                <div className='LoadWrapper'>
                    <div className="loader"></div>
                </div>
            </div>
        </div>
    )
}

export default Loading