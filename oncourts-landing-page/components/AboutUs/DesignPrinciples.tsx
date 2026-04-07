import { designPrinciplesData } from "../../data/about";
import { svgIcons } from "../../data/svgIcons";

export default function DesignPrinciples() {
    return <div className="bg-white rounded-lg shadow-lg mx-auto my-4 px-8 py-12 text-center text-[20px]">
        <h2 className="text-[64px] font-bold text-teal text-center mb-2">
            {designPrinciplesData.title}
        </h2>
        <h4 className="text-[32px] text-center mb-8">
            {designPrinciplesData.subTitle}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mx-8">
            {designPrinciplesData.items.map((item, index) => {
                const IconComponent = svgIcons[item.icon as keyof typeof svgIcons];
                return (
                    <div key={index} className="group border rounded-lg p-4 text-center transition-colors duration-300 hover:bg-teal bg-white border-teal cursor-pointer flex flex-col items-center justify-start text-teal hover:text-white">
                        <IconComponent />
                        <h3 className="font-bold text-lg uppercase text-teal transition-colors duration-300 group-hover:text-white mb-2">
                            {item.title}
                        </h3>
                        <p className="mt-2 text-black transition-colors duration-300 group-hover:text-white">{item.content}</p>
                    </div>
                )
            })}
        </div>
    </div>
}