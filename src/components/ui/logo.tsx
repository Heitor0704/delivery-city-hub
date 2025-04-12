
import { cn } from "@/lib/utils";

interface LogoProps {
  isCollapsed?: boolean;
  className?: string;
}

export function FomeXLogo({ isCollapsed = false, className }: LogoProps) {
  if (isCollapsed) {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="bg-fomex-orange rounded-md p-1">
          <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 15L85 85M85 15L15 85" stroke="white" strokeWidth="10" strokeLinecap="round"/>
            <path d="M50 10L90 50L50 90L10 50L50 10Z" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-fomex-orange rounded-md p-1">
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 15L85 85M85 15L15 85" stroke="white" strokeWidth="10" strokeLinecap="round"/>
          <path d="M50 10L90 50L50 90L10 50L50 10Z" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-bold text-xl text-gray-800">FomeX</span>
    </div>
  );
}
