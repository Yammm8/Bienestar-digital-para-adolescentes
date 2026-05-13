import { useState } from "react";
import { useNavigate } from "react-router";
import { Heart, Users, Leaf, ArrowRight } from "lucide-react";

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: Heart,
      title: "Bienvenido a una red social diferente",
      description: "Aquí no competimos por likes. Creamos conexiones reales y significativas.",
      color: "text-emerald-500",
    },
    {
      icon: Users,
      title: "Calidad sobre cantidad",
      description: "Feed cronológico. Sin algoritmos manipuladores. Comunidades pequeñas y auténticas.",
      color: "text-blue-500",
    },
    {
      icon: Leaf,
      title: "Diseñada para tu bienestar",
      description: "Límites conscientes, pausas saludables y transparencia total en cómo funciona.",
      color: "text-teal-500",
    },
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-green-50 px-6">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto">
        <div className={`mb-8 ${currentStep.color}`}>
          <Icon className="w-24 h-24" strokeWidth={1.5} />
        </div>

        <h1 className="text-center mb-4">{currentStep.title}</h1>
        <p className="text-center text-gray-600 mb-12 px-4">
          {currentStep.description}
        </p>

        <div className="flex gap-2 mb-12">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-8 bg-emerald-500" : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="pb-8 max-w-md mx-auto w-full">
        <button
          onClick={handleNext}
          className="w-full bg-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors"
        >
          {step < steps.length - 1 ? "Siguiente" : "Comenzar"}
          <ArrowRight className="w-5 h-5" />
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-gray-500 py-3 mt-2"
          >
            Atrás
          </button>
        )}
      </div>
    </div>
  );
}
