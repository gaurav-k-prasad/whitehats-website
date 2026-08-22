import React from "react";

export default function ProjectHero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-4 pb-2">
      {/* Left Column: Heading & Introduction */}
      <div className="lg:col-span-7 flex flex-col items-start gap-5">
        <div className="font-mono text-xs text-cyber-blue tracking-widest uppercase">
          // PROJECTS
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tight leading-tight">
          <span className="text-slate-100">&lt; OUR OPEN SOURCE</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue via-cyber-blue-light to-blue-300 drop-shadow-[0_0_25px_rgba(0,136,255,0.45)]">
            PROJECTS /&gt;
          </span>
        </h1>

        <div className="w-12 h-1 bg-cyber-blue/80 rounded-full" />

        <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-xl">
          Open source tools and research projects built by Whitehats Club members to solve real-world security problems, analyze threat vectors, and engineer defensive intelligence.
        </p>

        <div className="pt-2">
          <a
            href="https://github.com/TheWhitehatsclub-vit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-lg border border-card-border hover:border-cyber-blue/70 bg-card-bg/90 hover:bg-card-bg text-slate-100 hover:text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-lg hover:shadow-[0_0_20px_rgba(0,136,255,0.25)]"
          >
            {/* GitHub SVG */}
            <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>Explore All on GitHub</span>
            <svg
              className="w-3.5 h-3.5 text-cyber-blue-light"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </a>
        </div>
      </div>

      {/* Right Column: 3D Isometric Cyber Cube & Diagnostic Terminal Lines */}
      <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row items-center justify-center gap-6 relative">
        {/* Glow Halo Backdrop */}
        <div className="absolute inset-0 bg-cyber-blue/10 blur-3xl rounded-full pointer-events-none" />

        {/* 3D Cyber Cube Container */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center shrink-0">
          {/* Outer Rotating Radar Ring */}
          <div className="absolute inset-2 border border-cyber-blue/20 rounded-full border-dashed animate-spin [animation-duration:25s] pointer-events-none" />
          <div className="absolute inset-8 border border-cyber-blue-light/15 rounded-full pointer-events-none shadow-[0_0_20px_rgba(0,136,255,0.2)]" />

          {/* 3D Cube Isometric Graphic */}
          <div className="relative z-10 w-32 h-32 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full drop-shadow-[0_0_25px_rgba(0,136,255,0.7)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top Face */}
              <polygon
                points="100,30 165,65 100,100 35,65"
                fill="url(#cubeTopGradient)"
                stroke="#33A9FF"
                strokeWidth="1.5"
              />
              {/* Left Face */}
              <polygon
                points="35,65 100,100 100,175 35,140"
                fill="url(#cubeLeftGradient)"
                stroke="#0088FF"
                strokeWidth="1.5"
              />
              {/* Right Face */}
              <polygon
                points="100,100 165,65 165,140 100,175"
                fill="url(#cubeRightGradient)"
                stroke="#0088FF"
                strokeWidth="1.5"
              />

              {/* Code Emblems on faces */}
              <text
                x="68"
                y="125"
                fill="#33A9FF"
                fontSize="18"
                fontWeight="bold"
                fontFamily="monospace"
                opacity="0.9"
                transform="rotate(-15 68 125) skewY(20)"
              >
                &lt;/&gt;
              </text>
              <text
                x="122"
                y="140"
                fill="#33A9FF"
                fontSize="18"
                fontWeight="bold"
                fontFamily="monospace"
                opacity="0.9"
                transform="rotate(15 122 140) skewY(-20)"
              >
                &lt;/&gt;
              </text>

              <defs>
                <linearGradient id="cubeTopGradient" x1="100" y1="30" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#33A9FF" stopOpacity="0.8" />
                  <stop stopColor="#0088FF" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="cubeLeftGradient" x1="35" y1="65" x2="100" y2="175" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0088FF" stopOpacity="0.7" />
                  <stop stopColor="#030712" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="cubeRightGradient" x1="165" y1="65" x2="100" y2="175" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0055AA" stopOpacity="0.7" />
                  <stop stopColor="#0B1120" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Diagnostic Status Lines */}
        <div className="flex flex-col gap-2 font-mono text-xs tracking-wide">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-cyber-blue font-bold">&gt;</span>
            <span>scanning network...</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-cyber-blue font-bold">&gt;</span>
            <span>analyzing packets...</span>
          </div>
          <div className="flex items-center gap-2 text-cyber-blue-light font-medium">
            <span className="text-cyber-blue font-bold">&gt;</span>
            <span>securing tomorrow.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
