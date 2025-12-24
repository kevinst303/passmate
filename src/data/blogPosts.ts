
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string; // HTML or Markdown content
  author: string;
  date: string;
  readTime: string;
  image: string; // URL to a placeholder or real image
  category: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "guide-to-australian-citizenship-2025",
    title: "The Ultimate Guide to Australian Citizenship in 2025",
    excerpt: "Everything you need to know about becoming an Australian citizen, from eligibility requirements to the citizenship test.",
    content: `
      <h2>Becoming an Australian Citizen</h2>
      <p>Australian citizenship is a privilege that offers huge rewards. By becoming an Australian citizen, you are joining a unique national community. Our country is built on the contributions of citizens from many different backgrounds.</p>
      
      <h3>Eligibility Criteria</h3>
      <p>To be eligible for Australian citizenship by conferral, you generally need to:</p>
      <ul>
        <li>Be a permanent resident</li>
        <li>Meet the residence requirement (living in Australia for 4 years)</li>
        <li>Be of good character</li>
        <li>Have a basic knowledge of English</li>
        <li>Intend to live or maintain a close and continuing association with Australia</li>
        <li>Have an adequate knowledge of the privileges and responsibilities of Australian citizenship</li>
      </ul>

      <h3>The Citizenship Test</h3>
      <p>Most applicants will need to pass the Australian citizenship test. The test assesses your knowledge of Australia, its people, and its laws. It also includes questions on Australian values.</p>
      <p>At PassMate, we help you prepare for this test with our comprehensive questions and AI tutor.</p>
    `,
    author: "Ollie the Koala",
    date: "Dec 15, 2025",
    readTime: "5 min read",
    image: "https://placehold.co/800x600?text=Citizenship",
    category: "Citizenship"
  },
  {
    slug: "australian-visa-types-explained",
    title: "Australian Visa Types Explained: Which One is Right for You?",
    excerpt: "A breakdown of the most common Australian visas, including skilled migration, student visas, and family visas.",
    content: `
      <h2>Navigating Australian Visas</h2>
      <p>Australia has a complex visa system designed to meet the nation's economic and social needs. Whether you want to work, study, or live in Australia, there is likely a visa for you.</p>

      <h3>Skilled Migration</h3>
      <p>The skilled migration program is designed to attract people who can contribute to the Australian economy. Popular visas include:</p>
      <ul>
        <li><strong>Skilled Independent visa (subclass 189):</strong> For skilled workers who are not sponsored by an employer or family member.</li>
        <li><strong>Skilled Nominated visa (subclass 190):</strong> For skilled workers nominated by a state or territory government.</li>
      </ul>

      <h3>Student Visas</h3>
      <p>If you want to study in Australia, you will generally need a Student visa (subclass 500). This visa allows you to stay in Australia for up to 5 years and in line with your enrolment.</p>
    `,
    author: "Emma Smith",
    date: "Dec 10, 2025",
    readTime: "4 min read",
    image: "https://placehold.co/800x600?text=Visa",
    category: "Visas"
  },
  {
    slug: "living-in-australia-community-guide",
    title: "Living in Australia: A Guide to Community and Culture",
    excerpt: "Discover what makes the Australian community so unique, from our shared values to our love of sport and the outdoors.",
    content: `
      <h2>The Australian Way of Life</h2>
      <p>Australia is known for its relaxed lifestyle, stunning landscapes, and friendly people. But there is more to living here than just beaches and barbecues.</p>

      <h3>Multiculturalism</h3>
      <p>Australia is one of the most culturally diverse nations in the world. We celebrate our differences and believe that everyone should be given a "fair go".</p>

      <h3>Community Values</h3>
      <p>Australian society is valued on respect, freedom, and equality. We believe in:</p>
      <ul>
        <li>Respect for the freedom and dignity of the individual</li>
        <li>Freedom of religion</li>
        <li>Commitment to the rule of law</li>
        <li>Parliamentary democracy</li>
        <li>Equality of men and women</li>
      </ul>
    `,
    author: "Liam Wilson",
    date: "Nov 28, 2025",
    readTime: "3 min read",
    image: "https://placehold.co/800x600?text=Community",
    category: "Life in Australia"
  },
  {
    slug: "australian-citizenship-ceremony-what-to-expect",
    title: "The Australian Citizenship Ceremony: What to Expect",
    excerpt: "The final step in your journey to becoming a citizen. Learn about the pledge, the ceremony, and receiving your certificate.",
    content: `
      <h2>The Final Step: Your Citizenship Ceremony</h2>
      <p>The citizenship ceremony is a significant event where you make the Australian Citizenship Pledge. This is the final step in becoming an Australian citizen.</p>
      
      <h3>The Pledge</h3>
      <p>At the ceremony, you will be required to make the pledge of commitment. This is a public statement where you promise to be a loyal citizen to Australia and its people.</p>
      
      <h3>What Happens at the Ceremony?</h3>
      <ul>
        <li>Welcome and introduction</li>
        <li>Address by a guest speaker</li>
        <li>Making the Pledge</li>
        <li>Presentation of Citizenship Certificates</li>
        <li>Singing the Australian National Anthem</li>
      </ul>
    `,
    author: "Sarah Brown",
    date: "Jan 10, 2026",
    readTime: "4 min read",
    image: "https://placehold.co/800x600?text=Ceremony",
    category: "Citizenship"
  },
  {
    slug: "understanding-australian-values",
    title: "Understanding Australian Values for the Citizenship Test",
    excerpt: "A deep dive into the core values that define the Australian way of life, essential for your citizenship test preparation.",
    content: `
      <h2>Core Australian Values</h2>
      <p>Australian values are the fundamental principles that guide our society. Understanding these is crucial for the citizenship test.</p>
      
      <h3>Key Values to Remember</h3>
      <ul>
        <li><strong>Freedom of speech:</strong> The right to express your opinions.</li>
        <li><strong>Freedom of association:</strong> The right to join groups or organisations.</li>
        <li><strong>The rule of law:</strong> Everyone is equal before the law.</li>
        <li><strong>A 'Fair Go':</strong> Everyone should have an equal opportunity to succeed.</li>
      </ul>
      <p>At PassMate, our AI tutor can help you understand how these values are applied in everyday Australian life.</p>
    `,
    author: "Ollie the Koala",
    date: "Jan 5, 2026",
    readTime: "5 min read",
    image: "https://placehold.co/800x600?text=Values",
    category: "Citizenship"
  },
  {
    slug: "melbourne-vs-sydney-lifestyle-comparison",
    title: "Melbourne vs Sydney: Which City Suits Your Lifestyle?",
    excerpt: "Moving to Australia? We compare the two biggest cities to help you decide where to settle down.",
    content: `
      <h2>The Great Australian Debate: Sydney or Melbourne?</h2>
      <p>If you're planning a move to Australia, you've likely considered Sydney and Melbourne. Both are world-class cities, but তারা offer very different vibes.</p>
      
      <h3>Sydney: The Harbor City</h3>
      <p>Sydney is famous for its iconic Opera House, Harbour Bridge, and stunning beaches like Bondi. It's energetic, fast-paced, and has a great outdoor lifestyle.</p>
      
      <h3>Melbourne: The Cultural Capital</h3>
      <p>Melbourne is known for its coffee culture, hidden laneways, arts scene, and major sporting events. It's often voted one of the most liveable cities in the world.</p>
    `,
    author: "Chloe Jackson",
    date: "Dec 20, 2025",
    readTime: "6 min read",
    image: "https://placehold.co/800x600?text=Cities",
    category: "Life in Australia"
  }
];
