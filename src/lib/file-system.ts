
export interface File {
  type: 'file';
  name: string;
  content: string;
}

export interface Directory {
  type: 'directory';
  name: string;
  children: { [name: string]: File | Directory };
}

export const initialFileSystem: Directory = {
  type: 'directory',
  name: '~',
  children: {
    Home: {
      type: 'directory',
      name: 'Home',
      children: {
        'about-me.txt': {
          type: 'file',
          name: 'about-me.txt',
          content: `ZAIN UL ABIDEEN - FULL-STACK DEVELOPER

🚀 Passionate Full-Stack Developer specializing in the MERN stack and Next.js, with expertise in creating dynamic, high-performance web applications.

🎯 TECHNICAL EXPERTISE:
   • MERN Stack (MongoDB, Express.js, React, Node.js)
   • Next.js & Modern React Ecosystem
   • RESTful API Design & Development
   • Interactive Animations (GSAP, Three.js)
   • Responsive UI/UX with Tailwind CSS
   • Database Architecture & Optimization

💼 PROFESSIONAL HIGHLIGHTS:
   • 1+ years of professional development experience
   • Delivered 40% increase in user engagement
   • Built applications for international clients
   • Full-stack project lifecycle management

🔄 Constantly evolving with emerging technologies and best practices in web development.

📍 Based in Pakistan | Open to Opportunities
`,
        },
        'resume.pdf': {
            type: 'file',
            name: 'resume.pdf',
            content: `ZAIN UL ABIDEEN
 Lahore, Pakistan • 03003636186 • zaynobusiness@gmail.com
 https://github.com/hey-Zayn
 PROFESSIONAL SUMMARY:
 Full Stack Developer (MERN | Next.js) experienced in end-to-end project delivery. Skilled
 in React, Node.js, and modern UI libraries. Strong track record of meeting technical
 requirements and business objectives for diverse clients.
 EDUCATION:
 2022 - 2026 |  Lincoln University College Malaysia (LUC)
 Bachelor of Computer Science - CGPA-3.6/4.0
 2020 - 2022 |  Superior College Main Campus Lahore
 FSC PRE ENGINEERING 
AREAS OF EXPERTISE:
 LANGUAGES & FRAMEWORKS: JAVASCRIPT, REACT, NEXT.JS, NODE.JS,
 EXPRESS, HTML5, CSS3, SQL
 DATABASES & TOOLS: MONGODB, MYSQL, MONGOOSE, RESTFUL APIS, JWT,
 POSTMAN
 LIBRARIES & STYLING: REDUX, ZUSTAND, TAILWIND CSS, GSAP, THREE.JS,
 SPLINE
 Platforms & DevOps: Git, GitHub, Vercel, Netlify, Render, Linux, VS Code,
 Figma, WordPress
 PROFESSIONAL EXPERIENCE:
 Forward Solutions | Full Stack Web Development Intern
 Full Stack Developer |   June 2024 - August 2025
 Full-Stack Development: Engineered and deployed full-stack web applications using
 the MERN stack (MongoDB, Express.js, React, Node.js) and Next.js, managing the
 complete development lifecycle.
 Performance & SEO: Optimized application performance and search engine visibility
 by implementing server-side rendering (SSR) with Next.js, significantly improving Core
 Web Vitals.
 API & UI Development: Architected scalable RESTful APIs with Node.js/Express and
 built dynamic, responsive user interfaces with React and Tailwind CSS.
 User Engagement: Drove a 40% increase in user engagement by developing
 immersive, interactive front-end experiences using GSAP and Three.js.
 Agile Collaboration: Contributed to a cross-functional Agile team, utilizing Git for
 version control within a CI/CD pipeline to ensure rapid and reliable deployment.
PROFESSIONAL EXPERIENCE:
 Viper Technologies | Full Stack Web Development Intern
 Full Stack Developer |  Mar 2025 - May 2025
 Full-Stack Developer for MERN stack applications, involved in all SDLC phases
 Engineered responsive UIs with React and Tailwind CSS
 Built scalable RESTful APIs using Node.js and Express.js
 Managed MongoDB database architecture and optimization
 Collaborated in Agile environment using Git and CI/CD workflows
 Freelance 
Web Designer & Developer |  2023 - 2025
 Developed full-stack web applications for international clients using MERN stack and
 Next.js
 Engineered 20+ professional WordPress websites across multiple industries
 Created dynamic user interfaces with React, Tailwind CSS, GSAP, and Three.js
 Managed end-to-end project delivery for international clients using Agile
 methodologies
 Utilized remote collaboration tools for client communication and project
 management
 RELEVANT PROJECTS:
 ForwardSols Internal Management Platform
 Full Stack Development |  July, 2025 | 
https://forwardsols.com/dashboard
 Tech Stack: Next.js, Tailwind CSS, Node.js, Three.js, GSAP, Framer Motion, Shadcn/UI,
 Nodemailer
 Developed full-stack internal dashboard to automate business operations for
 content, courses, recruitment, and analytics
 Built secure admin panel with full CRUD functionality and automated email
 notifications using Nodemailer
 Improved recruitment pipeline efficiency with automated applicant status tracking
 and communications
 Enhanced user interface with modern visuals and animations using Three.js and
 GSAP
 Chatty - Real-Time Chat Application 
Full Stack Development |  July, 2025 | 
https://github.com/hey-Zayn/Chat-APP
 Tech Stack: MERN Stack (MongoDB, Express.js, React, Node.js), Socket.io, JWT,
 Zustand, Cloudinary, DaisyUI
 Engineered full-stack real-time chat application with Socket.io for instant messaging
 and media sharing
 Implemented secure JWT authentication and Cloudinary integration for media
 management
 Developed responsive UI with React and DaisyUI, managing global state with Zustand
 Built scalable REST API backend using Node.js, Express.js, and MongoDB
RELEVANT PROJECTS:
 Chismosa  (LMS)
 Full Stack Development |  
July, 2025 | github.com/hey-Zayn/Chismosa---LMS
 Tech Stack: MERN Stack (MongoDB, Express.js, React, Node.js), JWT, Redux,
 Cloudinary, GSAP, Shadcn/UI
 Architected full-stack LMS platform with video-based courses, enrollment, and
 learning systems
 Implemented JWT authentication with role-based access control (RBAC)
 Developed dynamic course builder with Cloudinary video upload and streaming
 Built student/instructor dashboards with progress tracking and content management
 Managed global state using Redux and created modern UI with Shadcn/UI and
 Tailwind CSS
 CMS - website
 Full Stack Development |  
July, 2025 | 
https://ow-ten.vercel.app/
 Tech Stack:  MERN Stack, Redux Toolkit, Tailwind CSS, Framer Motion.
 Developed a full-stack portfolio with a custom admin CMS for dynamic content
 management of projects, experience, and blog posts.
 Architected full CRUD operations and secure JWT authentication for seamless content
 updates.
 Built a responsive UI with React & Tailwind CSS, integrated smooth animations with
 Framer Motion/GSAP for enhanced user engagement.
 ChatPanda
 Full Stack Development |  July, 2025 | 
chat-panda.vercel.app
 Tech Stack: Next.js, Tailwind CSS, GSAP, Three.js, Spline
 Developed high-performance marketing website using Next.js and Tailwind CSS
 Implemented scroll-triggered animations and transitions with GSAP
 Integrated interactive 3D elements using Three.js and Spline
 Enhanced user engagement through motion design and visual storytelling
 INTERNAL COLLABORATION
 International Collaboration: Xegara World
 Technologies:  WordPress, Elementor, Adobe XD, Responsive Design
 Converted XD design specifications into fully functional, pixel-perfect WordPress
 website for international cryptocurrency platform
 Leveraged WordPress and Elementor to achieve design accuracy and responsive
 performance
 Recognized with performance bonus for exceeding client expectations and delivering
 exceptional quality
INTERNAL COLLABORATION
 International Collaboration : TQN 
Technologies:  WordPress, Elementor, Contact Form 7, Yoast SEO, Responsive Design
 Developed and launched two service-based websites for an international client using
 WordPress and Elementor
 Implemented lead generation with Contact Form 7 and optimized sites for
 search engines using Yoast SEO
 Delivered fully responsive, professional websites meeting international business
 standards
 International Collaboration : The Recovery Center USA
 Technologies:  Next.js, Redux, GSAP, Nodemailer, CMS Development, Responsive Design
 Architected a custom CMS portfolio for the Chief Strategy Officer using Next.js with
 dynamic theme selection (50+ themes)
 Developed admin dashboard with full CRUD operations for blogs, quotes, projects,
 experiences, and email subscribers
 Implemented Nodemailer for contact form submissions and subscriber
 communications
 Enhanced user experience with GSAP animations and managed complex state using
 Redux
 International Collaboration: 360SocialBoost & WebLinksBuilder
 Technologies:   WordPress, Elementor Pro, Contact Form 7, Yoast SEO, Rank
 Math, Responsive Design
 Developed and launched service websites for two international digital marketing
 clients using WordPress and Elementor Pro
 Implemented lead generation with Contact Form 7 and comprehensive SEO
 optimization using Yoast SEO and Rank Math
 Delivered responsive, conversion-optimized websites meeting international business
 requirements and client specifications
 CERTIFICATION AND ACTIVEMENTS
 Full-Stack Web Development Certification | IDEOVERSTY
 Learning Elementor for WordPress Design | Andrew Williams Udemy
 WordPress Essential Training | Sam Yankelevitch's LinkedIn Learning Courses
 JavaScript (Intermediate) Certificate | HackerRank 
Full-Stack Developer Intern | Viper Technologie`
        },
        Projects: {
          type: 'directory',
          name: 'Projects',
          children: {
            'e-commerce-platform.md': {
              type: 'file',
              name: 'e-commerce-platform.md',
              content: `# Project: E-commerce Platform

- **Description**: A full-stack e-commerce solution with features like product catalog, shopping cart, and Stripe integration.
- **Tech Stack**: Next.js, TypeScript, PostgreSQL, Prisma, Tailwind CSS.
- **URL**: (Link to live demo or GitHub repo)
`,
            },
            'real-time-chat-app.md': {
              type: 'file',
              name: 'real-time-chat-app.md',
              content: `# Project: Real-time Chat App

- **Description**: A chat application featuring real-time messaging, user authentication, and multiple chat rooms.
- **Tech Stack**: React, Firebase (Auth & Firestore), Framer Motion.
- **URL**: (Link to live demo or GitHub repo)
`,
            },
          },
        },
        Documents: {
            type: 'directory',
            name: 'Documents',
            children: {
                'README.md': {
                    type: 'file',
                    name: 'README.md',
                    content: 'This directory is for your documents.'
                }
            }
        },
        Pictures: {
            type: 'directory',
            name: 'Pictures',
            children: {}
        },
        Music: {
            type: 'directory',
            name: 'Music',
            children: {
                'lofi-study.mp3': {
                    type: 'file',
                    name: 'lofi-study.mp3',
                    content: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_181d739ac0.mp3'
                },
                'cinematic-hip-hop.mp3': {
                    type: 'file',
                    name: 'cinematic-hip-hop.mp3',
                    content: 'https://cdn.pixabay.com/download/audio/2024/04/23/audio_defcc0486c.mp3'
                },
                'tropical-summer.mp3': {
                    type: 'file',
                    name: 'tropical-summer.mp3',
                    content: 'https://cdn.pixabay.com/download/audio/2024/05/13/audio_a99a89796e.mp3'
                }
            }
        },
        Downloads: {
            type: 'directory',
            name: 'Downloads',
            children: {}
        },
        'contact.txt': {
          type: 'file',
          name: 'contact.txt',
          content: `You can reach me through the following channels:

- **Email**: zaynobusiness@gmail.com
- **LinkedIn**: linkedin.com/in/zayn-butt
- **GitHub**: github.com/hey-Zayn
`,
        },
      },
    },
  },
};

export const getPath = (
  path: string[],
  fs: Directory
): Directory | File | undefined => {
  let current: Directory | File = fs;
  for (const part of path) {
    if (part === '' || part === '~') continue; 

    if (current.type === 'directory' && current.children[part]) {
      current = current.children[part];
    } else {
      return undefined;
    }
  }
  return current;
};

// Helper function to get a unique name for a new file or folder
export const getUniqueName = (parent: Directory, baseName: string, type: 'file' | 'directory') => {
    const extension = type === 'file' && !baseName.endsWith('.txt') ? '.txt' : '';
    const nameWithoutExt = type === 'file' ? baseName.replace(/\.txt$/, '') : baseName;
    
    if (!parent.children[`${nameWithoutExt}${extension}`]) {
        return `${nameWithoutExt}${extension}`;
    }

    let i = 1;
    while (true) {
        const newName = `${nameWithoutExt} (${i})${extension}`;
        if (!parent.children[newName]) {
            return newName;
        }
        i++;
    }
};

export const deleteItem = (path: string, fs: Directory): boolean => {
    const pathParts = path.startsWith('~/') ? path.split('/').slice(1) : path.split('/');
    const itemName = pathParts.pop();
    if (!itemName) return false;

    const parentNode = getPath(pathParts, fs);
    if (parentNode && parentNode.type === 'directory' && parentNode.children[itemName]) {
        delete parentNode.children[itemName];
        return true;
    }
    return false;
};

export const renameItem = (path: string, newName: string, fs: Directory): boolean => {
    if (!newName) return false;
    const pathParts = path.startsWith('~/') ? path.split('/').slice(1) : path.split('/');
    const oldName = pathParts.pop();
    if (!oldName) return false;

    const parentNode = getPath(pathParts, fs);
    if (parentNode && parentNode.type === 'directory' && parentNode.children[oldName]) {
        const item = parentNode.children[oldName];
        if (item.type === 'file' && !/\.\w+$/.test(newName)) {
             const oldExt = oldName.match(/\.\w+$/);
             if (oldExt) {
                 newName += oldExt[0];
             }
        }

        if (parentNode.children[newName]) return false; // Name already exists

        delete parentNode.children[oldName];
        item.name = newName;
        parentNode.children[newName] = item;
        return true;
    }
    return false;
}
