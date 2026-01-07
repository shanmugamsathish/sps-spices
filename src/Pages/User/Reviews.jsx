import theme from "../../lib/theme";
import { REVIEWS } from "../../lib/constant";

export default function Reviews() {
  return (
    <div className="w-full overflow-hidden py-6">
      <div className="scroller">
        <div className="track">
          {/* Group 1 */}
          <div className="group">
            {REVIEWS.map((r, i) => (
              <Card key={i} {...r} />
            ))}
          </div>

          {/* Group 2 — identical clone */}
          <div className="group" aria-hidden="true">
            {REVIEWS.map((r, i) => (
              <Card key={`clone-${i}`} {...r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Card = ({ profilepic, name, title, text }) => (
  <div className="card">
    <div className="flex items-center gap-3 mb-3">
      <img 
        src={profilepic} 
        alt="profile" 
        className="w-12 h-12 rounded-full object-cover border-2"
        style={{ borderColor: theme.colors.border.light }}
      />
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div 
            className="font-semibold text-base"
            style={{ color: theme.colors.text.primary }}
          >
            {name}
          </div>
          <span className="text-yellow-500 text-sm">★★★★★</span>
        </div>
        <div 
          className="text-xs font-medium px-2 py-0.5 rounded-full inline-block w-fit"
          style={{ 
            backgroundColor: "#dcfce7", 
            color: "#166534" 
          }}
        >
          ✓ Verified Purchase
        </div>
      </div>
    </div>
    <div 
      className="mt-3 mb-2 font-bold text-base"
      style={{ color: theme.colors.text.primary }}
    >
      {title}
    </div>
    <div 
      className="text-sm leading-relaxed"
      style={{ color: theme.colors.text.secondary }}
    >
      {text}
    </div>
  </div>
);
