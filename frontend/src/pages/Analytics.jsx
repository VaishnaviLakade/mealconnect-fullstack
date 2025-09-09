import React from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
//import { Card, CardContent } from "@/components/ui/card";

const requestData = {
  successRate: [
    { name: "Successful Requests", value: 70 },
    { name: "Unfulfilled Requests", value: 30 },
  ],
  neededCategories: [
    { category: "Dairy", demand: 50 },
    { category: "Grains", demand: 40 },
    { category: "Cooked Meals", demand: 35 },
    { category: "Beverages", demand: 25 },
  ],
  colors: ["#4CAF50", "#FF5722"],
};

export default function Analytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* 2️⃣ Request Success Rate */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">Request Success Rate</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={requestData.successRate} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {requestData.successRate.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={requestData.colors[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3️⃣ Most Needed Food Categories */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold">Most Needed Food Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={requestData.neededCategories}>
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="demand" fill="#FFC107" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
