import profilepic1 from "../../assets/profilepic1.png";
import profilepic2 from "../../assets/profilepic2.png";
import profilepic3 from "../../assets/profilepic3.png";
import profilepic4 from "../../assets/profilepic4.png";
import profilepic5 from "../../assets/profilepic5.png";
import profilepic6 from "../../assets/profilepic6.png";
import theme from "../../lib/theme";

const reviews = [
  {
    profilepic: profilepic3,
    name: "Rajesh K",
    title: "Good Quality Spices",
    text: "I bought black pepper, cloves and cardamom. Spices are fresh and smell very nice. Happy with the purchase.",
  },
  {
    profilepic: profilepic2,
    name: "Arun Kumar",
    title: "சுத்தமான பேக்கிங் & புதிய பொருட்கள்",
    text: "பொருட்கள் சுத்தமாகவும் நன்றாக பேக் செய்யப்பட்டும் உள்ளன. வீட்டில் தயாரிக்கப்பட்ட மசாலாப் பொருட்கள் போல இருக்குது.",
  },
  {
    profilepic: profilepic1,
    name: "Priya R",
    title: "Good Dry Fruits for Daily Use",
    text: "Bought almonds, cashew and raisins. Dry fruits are fresh and crunchy. Worth the money.",
  },
  {
    profilepic: profilepic5,
    name: "Santhosh M",
    title: "Good Quality",
    text: "Purchased dried ginger, garlic and nutmeg. Using it for cooking. Taste is good and quality is nice.",
  },
  {
    profilepic: profilepic4,
    name: "Nisha K",
    title: "Kids Liked It",
    text: "Ordered pista and dried fruits like apricot and mango. Very soft and fresh. My kids liked it a lot.",
  },
  {
    profilepic: profilepic6,
    name: "Rahul A",
    title: "Good Kerala Spices",
    text: "Bought Marayoor jaggery and cardamom. Natural taste and good flavour. Will buy again.",
  },
];

export default function Reviews() {
  return (
    <div className="w-full overflow-hidden py-6">
      <div className="scroller">
        <div className="track">
          {/* Group 1 */}
          <div className="group">
            {reviews.map((r, i) => (
              <Card key={i} {...r} />
            ))}
          </div>

          {/* Group 2 — identical clone */}
          <div className="group" aria-hidden="true">
            {reviews.map((r, i) => (
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
