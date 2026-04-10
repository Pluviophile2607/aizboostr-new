import { CometCard } from "./CometCard";
import heroBanner from "https://cdn.designfast.io/image/2026-04-09/8619207e-97c3-4cae-95e1-24df84ca3abe.jpeg";

export default function CometCardDemo() {
  return (
    <CometCard>
      <div
        className="flex w-80 cursor-pointer flex-col items-stretch rounded-[16px] border-0 bg-[#1F2121] p-2 md:p-4"
        aria-label="View invite F7RA"
        style={{
          transformStyle: "preserve-3d",
          transform: "none",
          opacity: 1,
        }}
      >
        <div className="mx-2 flex-1">
          <div className="relative mt-2 aspect-[3/4] w-full">
            <img
              loading="lazy"
              className="absolute inset-0 h-full w-full rounded-[16px] bg-[#000000] object-cover contrast-75"
              alt="Invite background"
              src="https://cdn.designfast.io/image/2026-04-09/8619207e-97c3-4cae-95e1-24df84ca3abe.jpeg"
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 5px 6px 0px",
                opacity: 1,
              }}
            />
          </div>
        </div>
        <div className="mt-2 flex flex-shrink-0 items-center justify-between p-4 font-mono text-white">
          <div className="text-xs font-bold">Planned Maintenance</div>
          <div className="text-xs text-gray-300 opacity-50">#BACK-SOON</div>
        </div>
      </div>
    </CometCard>
  );
}
