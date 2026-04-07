import { newExperienceData } from "../../data/about"

export default function NewExperiences() {
    return <div className="bg-white rounded-lg shadow-lg mx-auto my-4 px-8 py-12 text-center text-[20px]">
        <h2 className="text-[64px] font-bold text-teal text-center mb-2">
            {newExperienceData.title}
        </h2>
        <h4 className="text-[32px] text-center mb-8">
            {newExperienceData.subTitle}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mx-8">
            {newExperienceData.items.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="group border rounded-lg text-center transition-colors duration-300 bg-white border-teal flex flex-col items-center justify-start text-teal"
                    >
                        <h3
                            className="w-full font-bold text-lg uppercase bg-teal text-white transition-colors duration-300 mb-2 px-4 py-2"
                        >
                            {item.title}
                        </h3>
                        <p className="mt-2 p-4 text-black transition-colors duration-300">
                            {item.content}
                        </p>
                    </div>
                )
            })}
        </div>
    </div>
}