# AI Dashboard

A modern Next.js 14 application that generates comprehensive dashboards with AI-powered insights using OpenAI ChatGPT API.

## Features

- 🤖 **AI-Powered Analytics**: Generate instant insights on any topic using OpenAI GPT
- 📊 **Interactive Charts**: Beautiful visualizations with Recharts (Bar, Line, Pie, Area charts)
- 📈 **KPI Metrics**: Dynamic key performance indicators with visual trends
- 🎨 **Modern UI**: Built with ShadCN UI components and Tailwind CSS
- 🌙 **Dark/Light Theme**: Complete theme switching support
- 📱 **Responsive Design**: Works perfectly on all device sizes
- ⚡ **Real-time Loading**: Elegant loading states and error handling
- 🔍 **Smart Search**: Intuitive search interface with example topics

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: Tailwind CSS + ShadCN UI
- **Charts**: Recharts
- **AI**: OpenAI GPT API
- **Theme**: next-themes
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd ai-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Use

1. **Enter a Topic**: Type any topic in the search bar (e.g., "Electric Vehicle Market", "Renewable Energy")
2. **Generate Dashboard**: Click "Analyze" or press Enter
3. **View Results**: The AI will generate:
   - Key metrics with values and descriptions
   - Interactive charts with relevant data
   - Strategic insights and recommendations
4. **Toggle Theme**: Use the theme switcher in the top-right corner
5. **Try Examples**: Click on the suggested example topics

## Project Structure

```
src/
├── app/
│   ├── api/generate-dashboard/
│   │   └── route.js              # OpenAI API integration
│   ├── globals.css               # Global styles and theme variables
│   ├── layout.js                 # Root layout with theme provider
│   └── page.js                   # Main dashboard page
├── components/
│   ├── ui/                       # ShadCN UI components
│   ├── charts-section.jsx        # Chart rendering component
│   ├── dashboard.jsx             # Main dashboard layout
│   ├── insights-section.jsx      # AI insights display
│   ├── loading-dashboard.jsx     # Loading state component
│   ├── metrics-grid.jsx          # KPI metrics grid
│   ├── search-bar.jsx            # Search interface
│   ├── theme-provider.jsx        # Theme context provider
│   └── theme-toggle.jsx          # Theme switcher component
└── lib/
    └── utils.js                  # Utility functions
```

## API Routes

### `POST /api/generate-dashboard`

Generates dashboard data for a given topic.

**Request Body**:
```json
{
  "topic": "Your topic here"
}
```

**Response**:
```json
{
  "topic": "Topic Name",
  "metrics": [
    {
      "title": "Metric Name",
      "value": "Value",
      "unit": "Unit",
      "description": "Description"
    }
  ],
  "charts": [
    {
      "type": "bar|line|pie|area",
      "title": "Chart Title",
      "data": [...],
      "xKey": "name",
      "yKey": "value"
    }
  ],
  "insights": [
    "Insight 1",
    "Insight 2"
  ]
}
```

## Customization

### Adding New Chart Types

Edit `src/components/charts-section.jsx` to add new chart types:

```javascript
case "custom":
  return (
    <CustomChart data={data}>
      {/* Your custom chart implementation */}
    </CustomChart>
  );
```

### Modifying AI Prompts

Update the prompt in `src/app/api/generate-dashboard/route.js` to change the AI's behavior and output format.

### Styling

- Modify `src/app/globals.css` for global styles
- Update component-specific styling in individual component files
- Customize theme colors in the CSS variables

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel dashboard
4. Deploy!

### Other Platforms

1. Build the project: `npm run build`
2. Set the `OPENAI_API_KEY` environment variable
3. Deploy the `.next` folder and run `npm start`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
