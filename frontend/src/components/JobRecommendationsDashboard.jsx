import { useState } from "react"
import JobRecommendationsPieChart from "./job-recommendations-pie-chart"
import JobRecommendationsBarChart from "./job-recommendations-bar-plot"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

// Job recommendation data based on the provided image
const jobRecommendationsData = [
  { role: "Software Developer", percentage: 38.7, color: "hsl(210, 79%, 46%)" },
  { role: "Information Security Analyst", percentage: 16.1, color: "hsl(32, 100%, 50%)" },
  { role: "Full Stack Developer with Security Focus", percentage: 14.5, color: "hsl(120, 61%, 34%)" },
  { role: "Data Analyst", percentage: 11.3, color: "hsl(0, 100%, 50%)" },
  { role: "Junior Software Developer", percentage: 8.1, color: "hsl(270, 50%, 60%)" },
  { role: "Junior Data Analyst", percentage: 6.5, color: "hsl(30, 51%, 35%)" },
  { role: "Consider additional training", percentage: 4.8, color: "hsl(330, 82%, 76%)" },
]

export default function JobRecommendationsDashboard() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="font-serif grid py-6 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Distribution of Job Recommendations</CardTitle>
          <CardDescription>Interactive visualization of recommended job roles based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pie" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            </TabsList>
            <TabsContent value="pie">
              <JobRecommendationsPieChart
                data={jobRecommendationsData}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </TabsContent>
            <TabsContent value="bar">
              <JobRecommendationsBarChart
                data={jobRecommendationsData}
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Job Role Details</CardTitle>
          <CardDescription>Information about the selected job role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: jobRecommendationsData[activeIndex].color }}
              />
              <h3 className="text-xl font-semibold">{jobRecommendationsData[activeIndex].role}</h3>
            </div>
            <p className="text-3xl font-bold">{jobRecommendationsData[activeIndex].percentage}%</p>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Role Description</h4>
              <p className="text-sm text-muted-foreground">
                {getRoleDescription(jobRecommendationsData[activeIndex].role)}
              </p>
            </div>
            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Required Skills</h4>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                {getRequiredSkills(jobRecommendationsData[activeIndex].role).map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getRoleDescription(role) {
  switch (role) {
    case "Software Developer":
      return "Designs, builds, and maintains software applications. Works with programming languages to create efficient and scalable solutions."
    case "Information Security Analyst":
      return "Protects computer systems and networks from cyber threats. Implements security measures and monitors for breaches."
    case "Full Stack Developer with Security Focus":
      return "Develops both front-end and back-end components with special emphasis on security best practices and vulnerability prevention."
    case "Data Analyst":
      return "Interprets complex data to inform business decisions. Creates visualizations and reports to communicate findings."
    case "Junior Software Developer":
      return "Entry-level role focused on learning software development practices while contributing to projects under supervision."
    case "Junior Data Analyst":
      return "Entry-level role focused on data collection, cleaning, and basic analysis under the guidance of senior analysts."
    case "Consider additional training":
      return "Your profile suggests that additional training or education would significantly improve your job prospects in your desired field."
    default:
      return "No description available."
  }
}

function getRequiredSkills(role) {
  switch (role) {
    case "Software Developer":
      return [
        "Programming languages (Java, Python, JavaScript)",
        "Data structures & algorithms",
        "Version control (Git)",
        "Problem-solving",
        "Software testing",
      ]
    case "Information Security Analyst":
      return [
        "Network security",
        "Vulnerability assessment",
        "Security frameworks",
        "Incident response",
        "Risk management",
      ]
    case "Full Stack Developer with Security Focus":
      return [
        "Front-end & back-end development",
        "Security best practices",
        "Authentication systems",
        "OWASP knowledge",
        "Secure API design",
      ]
    case "Data Analyst":
      return ["SQL", "Data visualization", "Statistical analysis", "Excel/spreadsheets", "Business intelligence tools"]
    case "Junior Software Developer":
      return [
        "Basic programming skills",
        "Understanding of development lifecycle",
        "Teamwork",
        "Learning mindset",
        "Basic testing",
      ]
    case "Junior Data Analyst":
      return ["Basic SQL", "Data cleaning", "Spreadsheet skills", "Basic statistics", "Attention to detail"]
    case "Consider additional training":
      return [
        "Identify skill gaps",
        "Research certification programs",
        "Online learning platforms",
        "Bootcamps",
        "Academic courses",
      ]
    default:
      return ["No skills available."]
  }
}
