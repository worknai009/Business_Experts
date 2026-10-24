import {
  Brain,
  Sparkles,
  Loader2,
  CheckCircle2,
  Search,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Lightbulb,
} from "lucide-react";

function LoadingCard() {
  const steps = [
    {
      icon: <Search size={20} />,
      title: "Understanding your business",
      desc: "Reading your business information",
    },
    {
      icon: <TrendingUp size={20} />,
      title: "Market Analysis",
      desc: "Checking demand and competition",
    },
    {
      icon: <BarChart3 size={20} />,
      title: "Financial Projection",
      desc: "Calculating revenue, expenses and ROI",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: "Risk Assessment",
      desc: "Finding possible business risks",
    },
    {
      icon: <Lightbulb size={20} />,
      title: "Generating AI Recommendation",
      desc: "Preparing the best business advice",
    },
  ];

  return (
    <div className="mt-10 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-10 text-center text-white">

        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur">

          <Loader2
            size={50}
            className="animate-spin"
          />

        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur">

          <Sparkles size={18} />

          <span className="font-semibold">
            Artificial Intelligence Working
          </span>

        </div>

        <h2 className="mt-6 text-4xl font-black">
          AI is Analysing Your Business
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
          Please wait while our AI analyses your business,
          evaluates market demand, competition,
          profitability and investment potential.
        </p>

      </div>

      {/* Body */}

      <div className="p-10">

        <div className="mb-8 h-3 overflow-hidden rounded-full bg-slate-200">

          <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

        </div>

        <div className="space-y-5">

          {steps.map((step, index) => (
            <div
              key={index}
              className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50"
            >

              <div className="flex items-center gap-4">

                <div className="rounded-2xl bg-blue-100 p-3 text-blue-600">

                  {step.icon}

                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {step.desc}
                  </p>

                </div>

              </div>

              <Brain
                className="animate-pulse text-blue-600"
                size={24}
              />

            </div>
          ))}

        </div>

        {/* Footer */}

        <div className="mt-10 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">

          <div className="flex items-center gap-3">

            <CheckCircle2
              className="text-green-600"
              size={24}
            />

            <div>

              <h3 className="font-bold text-slate-900">
                AI Processing in Progress
              </h3>

              <p className="text-slate-600">
                This normally takes 3–8 seconds depending on the complexity
                of your business analysis.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default LoadingCard;