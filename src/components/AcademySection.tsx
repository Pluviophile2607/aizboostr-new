import { GraduationCap, BookOpen, Video, Award, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import zedAcademyPose from "@/assets/zed-academy-pose.png";
const courseModules = [{
  icon: BookOpen,
  title: "AI Fundamentals",
  description: "Master the basics of AI and machine learning for business applications.",
  lessons: 12
}, {
  icon: Video,
  title: "Course Creation",
  description: "Learn to create and sell AI-powered courses that generate passive income.",
  lessons: 18
}, {
  icon: TrendingUp,
  title: "AI Marketing Mastery",
  description: "Use AI to automate and optimize your marketing for maximum ROI.",
  lessons: 15
}, {
  icon: Users,
  title: "Community Building",
  description: "Build and monetize an engaged community around your AI expertise.",
  lessons: 10
}];
const stats = [{
  value: "10K+",
  label: "Students Enrolled"
}, {
  value: "95%",
  label: "Completion Rate"
}, {
  value: "$50K+",
  label: "Avg. Student Revenue"
}, {
  value: "24/7",
  label: "Community Access"
}];
export function AcademySection() {
  return <section id="academy" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">AI Academy</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold">
              Learn to Build & Sell
              <span className="block text-primary glow-text">AI-Powered Courses</span>
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Join thousands of entrepreneurs who have turned their AI knowledge into 
              profitable course businesses. Our comprehensive academy teaches you everything.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg">
                Enroll Now
              </Button>
              <Button variant="outline" size="lg">
                View Curriculum
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-3xl blur-3xl" />
            <img alt="ZED teaching at AI Academy" className="relative rounded-3xl shadow-2xl" src="/lovable-uploads/fedd7044-7828-4934-99ba-e93e8cc0162c.jpg" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map(stat => <div key={stat.label} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>)}
        </div>

        {/* Course Modules */}
        <div className="space-y-8">
          <h3 className="text-3xl font-bold text-center">What You'll Learn</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {courseModules.map((module, index) => <div key={module.title} className="group glass-card p-6 rounded-2xl hover:border-primary/50 transition-all duration-300 flex gap-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                  <module.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-xl font-semibold">{module.title}</h4>
                    <span className="px-2 py-1 bg-secondary rounded-full text-xs text-muted-foreground">
                      {module.lessons} lessons
                    </span>
                  </div>
                  <p className="text-muted-foreground">{module.description}</p>
                </div>
              </div>)}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center glass-card p-12 rounded-3xl">
          <Award className="h-16 w-16 text-primary mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Get Certified in AI</h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Upon completion, receive an official AIZboostr certification that validates 
            your expertise in AI-powered business building.
          </p>
          <Button variant="glow" size="xl">
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </section>;
}