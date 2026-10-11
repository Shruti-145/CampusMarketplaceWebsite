import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type Page =
  | "landing"
  | "login"
  | "register"
  | "home"
  | "buy"
  | "product"
  | "sell"
  | "rent"
  | "rental"
  | "swap"
  | "proposal"
  | "saved"
  | "requests"
  | "profile"
  | "listings"
  | "notifications"
  | "contact";

type Product = {
  id: number;
  title: string;
  price: number;
  original?: number;
  category: string;
  condition: "Like New" | "Good" | "Fair";
  location: string;
  seller: string;
  image: string;
  description: string;
  listed: string;
  status?: "Active" | "Pending" | "Completed";
};

type RequestItem = {
  id: number;
  item: string;
  type: "Buy request" | "Rental request" | "Swap proposal";
  person: string;
  date: string;
  status: "Pending" | "Accepted" | "Declined" | "Completed";
  image: string;
};

const photos = {
  desk: "/images/campus-desk.jpg",
  calculator: "/images/calculator.jpg",
  papers: "/images/drawing-kit.jpg",
  book: "/images/textbook.jpg",
  headphones: "/images/headphones.jpg",
  night: "/images/night-desk.jpg",
  lamp: "/images/table-lamp.jpg",
  library: "/images/library.jpg",
  greenLamp: "/images/green-lamp.jpg",
  textile: "/images/textile.jpg",
};

const initialProducts: Product[] = [
  { id: 1, title: "Engineering Mathematics Textbook", price: 180, original: 620, category: "Books & Notes", condition: "Good", location: "Girls Hostel", seller: "Ananya S.", image: photos.book, description: "Third edition with clean pages and a few useful margin notes. Ideal for first-year engineering students.", listed: "Today" },
  { id: 2, title: "Casio Scientific Calculator", price: 450, original: 895, category: "Electronics", condition: "Like New", location: "Boys Hostel 7", seller: "Rahul K.", image: photos.calculator, description: "Fully working calculator with original slide cover. Used for one semester only.", listed: "Yesterday" },
  { id: 3, title: "Engineering Drawing Kit", price: 250, original: 480, category: "Lab Equipment", condition: "Good", location: "Academic Block", seller: "Mihir R.", image: photos.papers, description: "Complete mini drafter set with compass, dividers and scale set.", listed: "2 days ago" },
  { id: 4, title: "White Lab Coat", price: 150, original: 350, category: "Lab Equipment", condition: "Good", location: "Chemistry Block", seller: "Pooja M.", image: photos.library, description: "Medium-size lab coat, freshly washed and in good condition.", listed: "3 days ago" },
  { id: 5, title: "Everyday College Backpack", price: 350, original: 999, category: "Accessories", condition: "Good", location: "Main Gate", seller: "Aditya N.", image: photos.desk, description: "Spacious backpack with laptop sleeve and two bottle pockets.", listed: "Today" },
  { id: 6, title: "Over-Ear Headphones", price: 500, original: 1299, category: "Electronics", condition: "Fair", location: "Boys Hostel 2", seller: "Kunal D.", image: photos.headphones, description: "Comfortable wired headphones. Sound is clear; minor wear on the ear cups.", listed: "4 days ago" },
  { id: 7, title: "Festive Cotton Kurta", price: 300, original: 850, category: "Clothing & Fest Wear", condition: "Like New", location: "Girls Hostel", seller: "Neha P.", image: photos.textile, description: "Bottle-green cotton kurta, size M. Worn once for the college fest.", listed: "Yesterday" },
  { id: 8, title: "Study Table Lamp", price: 200, original: 499, category: "Hostel Essentials", condition: "Good", location: "Boys Hostel 1", seller: "Sarthak J.", image: photos.greenLamp, description: "Compact adjustable study lamp with warm white LED bulb.", listed: "2 days ago" },
];

const rentals = [
  { id: 101, title: "DSLR Camera Kit", price: 180, unit: "day", deposit: 1000, category: "Cameras", condition: "Good", location: "Admin Block", seller: "Ishaan G.", image: photos.night, description: "Entry-level DSLR with 18–55mm lens, battery, charger and carrying case." },
  { id: 102, title: "Scientific Calculator", price: 50, unit: "day", deposit: 300, category: "Electronics", condition: "Like New", location: "Boys Hostel 7", seller: "Rahul K.", image: photos.calculator, description: "Perfect for exams and lab work. Includes hard cover." },
  { id: 103, title: "Badminton Racket Pair", price: 120, unit: "week", deposit: 250, category: "Sports", condition: "Good", location: "Sports Complex", seller: "Vivek A.", image: photos.desk, description: "Two lightweight rackets with three shuttlecocks and a carry bag." },
  { id: 104, title: "Festive Kurta Set", price: 150, unit: "day", deposit: 500, category: "Festive clothing", condition: "Like New", location: "Girls Hostel", seller: "Neha P.", image: photos.textile, description: "Comfortable festive set for campus celebrations. Size M." },
];

const swaps = [
  { id: 201, title: "Applied Physics Textbook", value: 250, wants: "Scientific calculator or lab coat", owner: "Riya S.", location: "Girls Hostel", condition: "Good", image: photos.book },
  { id: 202, title: "Scientific Calculator", value: 300, wants: "Engineering textbook", owner: "Aman V.", location: "Boys Hostel 4", condition: "Good", image: photos.calculator },
  { id: 203, title: "Desk Lamp", value: 220, wants: "Backpack or headphones", owner: "Harsh P.", location: "Boys Hostel 1", condition: "Like New", image: photos.greenLamp },
  { id: 204, title: "College Fest Kurta", value: 350, wants: "Sports gear", owner: "Kabir M.", location: "Main Gate", condition: "Like New", image: photos.textile },
];

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    bag: <><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrows: <><path d="m17 3 4 4-4 4" /><path d="M3 7h18M7 21l-4-4 4-4" /><path d="M21 17H3" /></>,
    cart: <><path d="M3 3h2l2 12h10l3-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
    key: <><circle cx="8" cy="15" r="4" /><path d="m11 12 9-9M17 6l3 3" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    arrow: <><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" /><path d="M10 11v6M14 11v6" /></>,
    message: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Logo({ onClick }: { onClick: () => void }) {
  return <button className="logo" onClick={onClick} aria-label="Campus Cart home"><span className="logo-mark"><Icon name="bag" size={21} /></span><span>Campus <b>Cart</b></span></button>;
}

function Button({ children, variant = "primary", icon, onClick, type = "button", disabled = false, className = "" }: { children: ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean; className?: string }) {
  return <button type={type} className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>{icon && <Icon name={icon} size={18} />}{children}</button>;
}

function Field({ label, error, children, hint }: { label: string; error?: string; children: ReactNode; hint?: string }) {
  return <label className={`field ${error ? "has-error" : ""}`}><span>{label}</span>{children}{hint && <small>{hint}</small>}{error && <small className="error">{error}</small>}</label>;
}

function Badge({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "amber" | "red" | "gray" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Toast({ message }: { message: string }) {
  return <div className="toast" role="status"><Icon name="check" size={18} />{message}</div>;
}

function Header({ page, navigate, query, setQuery, savedCount }: { page: Page; navigate: (p: Page) => void; query: string; setQuery: (v: string) => void; savedCount: number }) {
  const [open, setOpen] = useState(false);
  return <header className="app-header">
    <div className="header-inner">
      <Logo onClick={() => navigate("home")} />
      <div className="header-search">
        <Icon name="search" size={18} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && navigate("buy")} placeholder="Search books, calculators, lab kits..." aria-label="Search marketplace" />
        {query && <button onClick={() => setQuery("")} aria-label="Clear search"><Icon name="close" size={16} /></button>}
      </div>
      <nav className="desktop-nav" aria-label="Main navigation">
        {(["buy", "sell", "rent", "swap"] as Page[]).map((item) => <button key={item} className={page === item ? "active" : ""} onClick={() => navigate(item)}>{item === "swap" ? "Exchange" : item[0].toUpperCase() + item.slice(1)}</button>)}
      </nav>
      <div className="header-actions">
        <button className="icon-btn count-wrap" onClick={() => navigate("saved")} aria-label="Saved items"><Icon name="heart" /><span>{savedCount}</span></button>
        <button className="icon-btn dot-wrap" onClick={() => navigate("notifications")} aria-label="Notifications"><Icon name="bell" /><i /></button>
        <button className="avatar-button" onClick={() => setOpen(!open)}><span className="avatar">AS</span><span className="avatar-name">Aarav <Icon name="chevron" size={14} /></span></button>
        {open && <div className="profile-menu">
          <button onClick={() => { navigate("profile"); setOpen(false); }}>Profile</button>
          <button onClick={() => { navigate("listings"); setOpen(false); }}>My Listings</button>
          <button onClick={() => { navigate("requests"); setOpen(false); }}>My Requests</button>
          <button onClick={() => { navigate("landing"); setOpen(false); }}>Log out</button>
        </div>}
      </div>
    </div>
  </header>;
}

function BottomNav({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  const items = [{ p: "home" as Page, i: "home", l: "Home" }, { p: "buy" as Page, i: "search", l: "Search" }, { p: "sell" as Page, i: "plus", l: "Sell" }, { p: "profile" as Page, i: "user", l: "Profile" }];
  return <nav className="bottom-nav">{items.map((x) => <button key={x.p} onClick={() => navigate(x.p)} className={page === x.p ? "active" : ""}><span className={x.p === "sell" ? "sell-round" : ""}><Icon name={x.i} /></span>{x.l}</button>)}</nav>;
}

function SearchBar({ query, setQuery, onSearch }: { query: string; setQuery: (v: string) => void; onSearch: () => void }) {
  return <div className="search-large"><Icon name="search" size={21} /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()} placeholder="What do you need for campus?" /><Button onClick={onSearch}>Search</Button></div>;
}

function ProductCard({ product, saved, toggleSaved, onOpen }: { product: Product; saved: boolean; toggleSaved: (id: number) => void; onOpen: () => void }) {
  return <article className="product-card">
    <div className="product-image" onClick={onOpen}><img src={product.image} alt={product.title} /><Badge>{product.condition}</Badge><button className={`heart-btn ${saved ? "saved" : ""}`} onClick={(e) => { e.stopPropagation(); toggleSaved(product.id); }} aria-label={saved ? "Remove from saved" : "Save item"}><Icon name="heart" size={19} /></button></div>
    <button className="product-info" onClick={onOpen}>
      <span className="product-category">{product.category}</span>
      <strong>{product.title}</strong>
      <span className="price">₹{product.price.toLocaleString("en-IN")} {product.original && <del>₹{product.original.toLocaleString("en-IN")}</del>}</span>
      <span className="meta-row"><span className="mini-avatar">{product.seller[0]}</span>{product.seller}<i />{product.location}</span>
    </button>
  </article>;
}

function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: () => void }) {
  return <div className="section-title"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action && <button onClick={action}>View all <Icon name="chevron" size={16} /></button>}</div>;
}

function Landing({ navigate }: { navigate: (p: Page) => void }) {
  const [info, setInfo] = useState<string | null>(null);
  const features = [
    { icon: "cart", title: "Buy", text: "Find affordable essentials listed by fellow students." },
    { icon: "plus", title: "Sell", text: "Turn unused belongings into money." },
    { icon: "key", title: "Rent", text: "Get what you need without buying it permanently." },
    { icon: "arrows", title: "Exchange", text: "Trade what you have for what you need." },
  ];
  return <div className="landing">
    <header className="landing-header"><div className="landing-nav"><Logo onClick={() => navigate("landing")} /><nav><button onClick={() => navigate("home")}>Explore</button><button onClick={() => navigate("buy")}>Buy</button><button onClick={() => navigate("rent")}>Rent</button><button onClick={() => navigate("swap")}>Exchange</button></nav><div><Button variant="ghost" onClick={() => navigate("login")}>Log in</Button><Button onClick={() => navigate("register")}>Join Campus Cart</Button></div></div></header>
    <main>
      <section className="hero landing-width">
        <div className="hero-copy"><span className="eyebrow">BIT SINDRI'S STUDENT MARKETPLACE</span><h1>Everything You Need,<br /><em>Right on Campus.</em></h1><p>Buy, sell, rent, and exchange everyday essentials with students around your campus. Save money, skip delivery fees, and give useful items a second life.</p><div className="hero-actions"><Button onClick={() => navigate("home")}>Explore Marketplace <Icon name="chevron" size={17} /></Button><Button variant="secondary" onClick={() => navigate("sell")}>Start Selling</Button></div><div className="trust-row"><span className="avatar-stack"><i>AS</i><i>RK</i><i>NP</i></span><span>Made for students, by students<br /><b>Safe campus handoffs</b></span></div></div>
        <div className="hero-collage"><div className="hero-main-img"><img src={photos.desk} alt="Student desk with useful campus items" /><span><b>Campus finds</b><small>Affordable. Nearby. Sustainable.</small></span></div><div className="floating-product float-one"><img src={photos.calculator} alt="" /><span><b>Calculator</b><small>₹450</small></span></div><div className="floating-product float-two"><img src={photos.book} alt="" /><span><b>Textbooks</b><small>From ₹180</small></span></div></div>
      </section>
      <section className="feature-wrap landing-width"><div className="feature-grid">{features.map((f) => <button key={f.title} onClick={() => navigate(f.title === "Exchange" ? "swap" : f.title.toLowerCase() as Page)} className="feature-card"><span><Icon name={f.icon} /></span><h3>{f.title}</h3><p>{f.text}</p><i><Icon name="chevron" size={16} /></i></button>)}</div></section>
      <section className="how landing-width"><div className="how-heading"><span className="eyebrow">SIMPLE BY DESIGN</span><h2>From “I need it” to “Got it.”</h2><p>Four easy steps. No delivery fees. No complicated checkout.</p></div><div className="steps">{["Join with your student account", "Discover or list an item", "Connect with another student", "Meet at a campus handoff point"].map((x, i) => <div key={x}><span>0{i + 1}</span><b>{x}</b><p>{i === 0 ? "Create your community profile." : i === 1 ? "Search, save, rent, or swap." : i === 2 ? "Send a safe in-app request." : "Inspect the item and complete."}</p></div>)}</div></section>
      <section className="sustain landing-width"><div><span className="eyebrow light">BETTER FOR YOUR WALLET. BETTER FOR CAMPUS.</span><h2>Good items deserve<br />a second life.</h2><p>Campus reuse helps students spend less and keeps useful things in circulation—not in storage or waste.</p><Button variant="secondary" onClick={() => navigate("home")}>Explore pre-loved items</Button></div><img src={photos.library} alt="Campus library desks and books" /></section>
      <section className="final-cta landing-width"><span className="eyebrow">READY WHEN YOU ARE</span><h2>Your campus marketplace is open.</h2><p>Find what you need, pass on what you don't.</p><Button onClick={() => navigate("register")}>Join Campus Cart</Button></section>
    </main>
    <footer><div className="landing-width"><Logo onClick={() => navigate("landing")} /><p>Your Campus. Your Marketplace.</p><nav>{["About", "Help", "Safety Guidelines", "Privacy"].map((item) => <button key={item} onClick={() => setInfo(item)}>{item}</button>)}</nav><small>© 2026 Campus Cart · Hackathon prototype for BIT Sindri</small></div></footer>
    {info && <Modal title={info} onClose={() => setInfo(null)}><p>{info === "About" ? "Campus Cart is a student marketplace prototype for buying, selling, renting and exchanging useful items within BIT Sindri." : info === "Help" ? "Browse the marketplace, open an item, and send a demo request. For safety, arrange handoffs at a public campus location." : info === "Safety Guidelines" ? "Meet in a public place, inspect items before agreeing, keep private room details confidential, and report suspicious activity." : "This prototype stores listings, requests, and saved items only in your browser. No backend account or payment data is collected."}</p><div className="modal-actions"><Button onClick={() => setInfo(null)}>Got it</Button></div></Modal>}
  </div>;
}

function AuthPage({ mode, navigate }: { mode: "login" | "register"; navigate: (p: Page) => void }) {
  const [show, setShow] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (!String(data.get("email")).includes("@")) next.email = "Enter a valid college email.";
    if (String(data.get("password")).length < 6) next.password = "Password must contain at least 6 characters.";
    if (mode === "register") {
      if (!data.get("name")) next.name = "Full name is required.";
      if (String(data.get("registration")).trim().length < 5) next.registration = "Enter your college registration number.";
      if (data.get("password") !== data.get("confirmPassword")) next.confirmPassword = "Passwords do not match.";
      if (!data.get("terms")) next.terms = "Accept the terms to continue.";
    }
    setErrors(next);
    if (!Object.keys(next).length) setSubmitted(true);
  };
  if (submitted) return <div className="auth-page"><div className="auth-card success-card"><span className="success-icon"><Icon name="check" size={28} /></span><h1>{mode === "login" ? "Welcome back, Aarav!" : "You're ready to explore."}</h1><p>This is a simulated student account for the Campus Cart prototype.</p><Button onClick={() => navigate("home")}>Go to marketplace</Button></div></div>;
  return <div className="auth-page"><button className="back-link" onClick={() => navigate("landing")}><Icon name="arrow" size={18} /> Back to home</button><div className="auth-card"><Logo onClick={() => navigate("landing")} /><span className="auth-kicker">STUDENT-ONLY MARKETPLACE</span><h1>{mode === "login" ? "Welcome back" : "Join your campus community"}</h1><p>{mode === "login" ? "Sign in to continue buying, selling, renting and swapping." : "Create a demo profile and start making campus life more affordable."}</p><form onSubmit={submit}>
    {mode === "register" && <div className="form-grid"><Field label="Full name" error={errors.name}><input name="name" placeholder="Aarav Sharma" /></Field><Field label="Registration number" error={errors.registration}><input name="registration" placeholder="BIT/2024/..." /></Field></div>}
    <Field label="College email" error={errors.email}><input name="email" type="email" placeholder="name@bitsindri.ac.in" /></Field>
    {mode === "register" && <div className="form-grid"><Field label="Branch / Department"><select name="branch"><option>Computer Science Engineering</option><option>Mechanical Engineering</option><option>Electrical Engineering</option><option>Civil Engineering</option></select></Field><Field label="Year of study"><select name="year"><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option></select></Field><Field label="Campus location"><select name="location"><option>Boys Hostel 7</option><option>Girls Hostel</option><option>Day scholar</option></select></Field></div>}
    <Field label="Password" error={errors.password}><div className="password-wrap"><input name="password" type={show ? "text" : "password"} placeholder="At least 6 characters" /><button type="button" onClick={() => setShow(!show)} aria-label="Toggle password visibility"><Icon name="eye" size={18} /></button></div></Field>
    {mode === "register" && <Field label="Confirm password" error={errors.confirmPassword}><input name="confirmPassword" type={show ? "text" : "password"} placeholder="Repeat your password" /></Field>}
    {mode === "login" ? <div className="form-options"><label><input type="checkbox" /> Remember me</label><button type="button" onClick={() => setNotice("Password recovery is simulated. Contact the campus help desk in a production version.")}>Forgot password?</button></div> : <><label className="terms"><input name="terms" type="checkbox" /> I agree to the Terms and campus safety guidelines.</label>{errors.terms && <small className="form-error">{errors.terms}</small>}</>}
    {notice && <div className="inline-notice">{notice}</div>}
    <Button type="submit" className="full">{mode === "login" ? "Sign in" : "Create student profile"}</Button>
  </form><small>Campus Cart is designed for your college community. Authentication is simulated in this prototype.</small><p className="auth-switch">{mode === "login" ? "New to Campus Cart?" : "Already have an account?"} <button onClick={() => navigate(mode === "login" ? "register" : "login")}>{mode === "login" ? "Create account" : "Sign in"}</button></p></div></div>;
}

function Home({ products, saved, toggleSaved, openProduct, navigate, query, setQuery }: { products: Product[]; saved: number[]; toggleSaved: (id: number) => void; openProduct: (id: number) => void; navigate: (p: Page) => void; query: string; setQuery: (v: string) => void }) {
  const categories = ["All", "Books & Notes", "Electronics", "Lab Equipment", "Hostel Essentials", "Clothing & Fest Wear", "Sports", "Accessories"];
  const [category, setCategory] = useState("All");
  const shown = category === "All" ? products : products.filter((p) => p.category === category);
  const actions = [{ title: "Buy something", text: "Browse affordable campus finds", icon: "cart", p: "buy" }, { title: "Sell something", text: "Give your item a new home", icon: "plus", p: "sell" }, { title: "Rent something", text: "Borrow it for as long as needed", icon: "key", p: "rent" }, { title: "Exchange something", text: "Trade, don't spend", icon: "arrows", p: "swap" }];
  return <main className="page page-home">
    <section className="welcome"><div><h1>Hey, Aarav!</h1><p>What are you looking for today?</p></div><span className="location-pill">BIT Sindri · Boys Hostel 7</span></section>
    <SearchBar query={query} setQuery={setQuery} onSearch={() => navigate("buy")} />
    <section className="action-grid">{actions.map((x) => <button key={x.title} className="action-card" onClick={() => navigate(x.p as Page)}><span><Icon name={x.icon} size={23} /></span><div><b>{x.title}</b><small>{x.text}</small></div><Icon name="chevron" size={17} /></button>)}</section>
    <section className="category-row"><span>Browse by category</span><div>{categories.map((x) => <button className={category === x ? "active" : ""} onClick={() => setCategory(x)} key={x}>{x}</button>)}</div></section>
    <section><SectionTitle title="Recently listed" subtitle="Fresh finds from students around campus" action={() => navigate("buy")} />{shown.length ? <div className="product-grid">{shown.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} saved={saved.includes(p.id)} toggleSaved={toggleSaved} onOpen={() => openProduct(p.id)} />)}</div> : <EmptyState icon="search" title="No items in this category yet" text="Try another category or browse every active listing." action="Browse all items" onAction={() => navigate("buy")} />}</section>
    <section><SectionTitle title="Budget-friendly finds" subtitle="Great picks under ₹400" action={() => navigate("buy")} /><div className="product-grid compact-grid">{products.filter((p) => p.price < 400).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} saved={saved.includes(p.id)} toggleSaved={toggleSaved} onOpen={() => openProduct(p.id)} />)}</div></section>
    <section className="near-banner"><div><span className="eyebrow light">AVAILABLE NEAR YOU</span><h2>Find it in your hostel,<br />not across the city.</h2><p>Browse items listed around Boys Hostel 7 and nearby campus blocks.</p><Button variant="secondary" onClick={() => navigate("buy")}>See nearby items</Button></div><img src={photos.night} alt="Student study space near campus" /></section>
  </main>;
}

function BuyPage({ products, saved, toggleSaved, openProduct, query, setQuery }: { products: Product[]; saved: number[]; toggleSaved: (id: number) => void; openProduct: (id: number) => void; query: string; setQuery: (v: string) => void }) {
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [location, setLocation] = useState("All locations");
  const [sort, setSort] = useState("Newest");
  const [max, setMax] = useState(1500);
  const [filterOpen, setFilterOpen] = useState(false);
  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const out = products.filter((p) => (!p.status || p.status === "Active") && (!q || `${p.title} ${p.category} ${p.description} ${p.location}`.toLowerCase().includes(q)) && (category === "All" || p.category === category) && (condition === "All" || p.condition === condition) && (location === "All locations" || p.location === location) && p.price <= max);
    return [...out].sort((a, b) => sort === "Price: Low to high" ? a.price - b.price : sort === "Price: High to low" ? b.price - a.price : b.id - a.id);
  }, [products, query, category, condition, location, max, sort]);
  const clear = () => { setCategory("All"); setCondition("All"); setLocation("All locations"); setMax(1500); setQuery(""); };
  const filters = <><div className="filter-heading"><h3>Filters</h3><button onClick={clear}>Clear all</button></div><Field label="Category"><select value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option>{[...new Set(products.map((p) => p.category))].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label={`Maximum price · ₹${max}`}><input type="range" min="150" max="1500" step="50" value={max} onChange={(e) => setMax(+e.target.value)} /></Field><div className="filter-checks"><b>Condition</b>{["All", "Like New", "Good", "Fair"].map((x) => <label key={x}><input type="radio" name="condition" checked={condition === x} onChange={() => setCondition(x)} />{x}</label>)}</div><Field label="Campus location"><select value={location} onChange={(e) => setLocation(e.target.value)}><option>All locations</option>{[...new Set(products.map((p) => p.location))].map((x) => <option key={x}>{x}</option>)}</select></Field></>;
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">BUY ON CAMPUS</span><h1>Find your next campus essential.</h1><p>Quality pre-owned items, listed by students you can meet nearby.</p></div></div><SearchBar query={query} setQuery={setQuery} onSearch={() => document.querySelector(".results")?.scrollIntoView({ behavior: "smooth", block: "start" })} /><div className="mobile-filter-bar"><Button variant="secondary" icon="filter" onClick={() => setFilterOpen(true)}>Filters</Button><span>{filtered.length} results</span></div><div className="browse-layout"><aside className="filters">{filters}</aside><div className="results"><div className="results-top"><span><b>{filtered.length}</b> items found</span><Field label="Sort by"><select value={sort} onChange={(e) => setSort(e.target.value)}><option>Newest</option><option>Price: Low to high</option><option>Price: High to low</option></select></Field></div>{filtered.length ? <div className="product-grid grid-three">{filtered.map((p) => <ProductCard key={p.id} product={p} saved={saved.includes(p.id)} toggleSaved={toggleSaved} onOpen={() => openProduct(p.id)} />)}</div> : <EmptyState icon="search" title="No items found" text="Try a different search or adjust your filters." action="Clear filters" onAction={clear} />}</div></div>{filterOpen && <div className="drawer-backdrop" onClick={() => setFilterOpen(false)}><aside className="filter-drawer" onClick={(e) => e.stopPropagation()}><button className="drawer-close" onClick={() => setFilterOpen(false)}><Icon name="close" /></button>{filters}<Button className="full" onClick={() => setFilterOpen(false)}>Show {filtered.length} items</Button></aside></div>}</main>;
}

function ProductDetails({ product, saved, toggleSaved, navigate, addRequest }: { product: Product; saved: boolean; toggleSaved: (id: number) => void; navigate: (p: Page) => void; addRequest: (r: RequestItem) => void }) {
  const [modal, setModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [galleryImage, setGalleryImage] = useState(product.image);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSent, setReportSent] = useState(false);
  useEffect(() => setGalleryImage(product.image), [product.id, product.image]);
  const request = () => { addRequest({ id: Date.now(), item: product.title, type: "Buy request", person: product.seller, date: "Today", status: "Pending", image: product.image }); setSuccess(true); };
  return <main className="page detail-page"><button className="back-link inline" onClick={() => navigate("buy")}><Icon name="arrow" size={18} /> Back to listings</button><div className="detail-layout"><section className="gallery"><div className="gallery-main"><img src={galleryImage} alt={product.title} /></div><div className="thumbs">{[product.image, photos.papers, photos.desk].map((x, i) => <button aria-label={`View image ${i + 1}`} className={galleryImage === x ? "active" : ""} onClick={() => setGalleryImage(x)} key={i}><img src={x} alt="" /></button>)}</div></section><section className="detail-info"><div className="detail-kickers"><Badge>{product.condition}</Badge><span>{product.category}</span></div><h1>{product.title}</h1><div className="detail-price">₹{product.price.toLocaleString("en-IN")} {product.original && <del>₹{product.original.toLocaleString("en-IN")}</del>}<small>{product.original && `${Math.round((1 - product.price / product.original) * 100)}% below original price`}</small></div><div className="detail-actions"><Button onClick={() => setModal(true)}>Send buy request</Button><Button variant="secondary" icon="message" onClick={() => navigate("contact")}>Contact seller</Button><button className={`save-wide ${saved ? "saved" : ""}`} onClick={() => toggleSaved(product.id)}><Icon name="heart" />{saved ? "Saved" : "Save"}</button></div><div className="detail-block"><h3>About this item</h3><p>{product.description}</p><dl><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Listed</dt><dd>{product.listed}</dd></div><div><dt>Pickup</dt><dd>{product.location}</dd></div><div><dt>Category</dt><dd>{product.category}</dd></div></dl></div><div className="seller-card"><span className="avatar large">{product.seller.split(" ").map((x) => x[0]).join("")}</span><div><small>LISTED BY</small><b>{product.seller}</b><span>BIT Sindri student · {product.location}</span></div><Icon name="chevron" /></div><div className="safety-note"><b>Meet safely on campus</b><p>Arrange the exchange at a convenient public campus location and inspect the item before completing the transaction.</p></div><button className="report" onClick={() => setReportOpen(true)}>Report listing</button></section></div>
    {reportOpen && <Modal title={reportSent ? "Report recorded" : "Report listing"} onClose={() => { setReportOpen(false); setReportSent(false); }}>{reportSent ? <div className="modal-success"><span className="success-icon"><Icon name="check" /></span><p>Your demo report was recorded locally. No report was sent to a backend.</p><Button onClick={() => { setReportOpen(false); setReportSent(false); }}>Done</Button></div> : <><p>Choose a reason for this demo report. No report is sent to a backend.</p><Field label="Reason"><select><option>Item appears unavailable</option><option>Misleading description</option><option>Unsafe or prohibited item</option><option>Other concern</option></select></Field><div className="modal-actions"><Button variant="ghost" onClick={() => setReportOpen(false)}>Cancel</Button><Button onClick={() => setReportSent(true)}>Submit demo report</Button></div></>}</Modal>}
    {modal && <Modal title={success ? "Request sent" : "Confirm buy request"} onClose={() => setModal(false)}>{success ? <div className="modal-success"><span className="success-icon"><Icon name="check" /></span><p>Your request has been sent to {product.seller}. No payment has been processed.</p><Button onClick={() => navigate("requests")}>View my requests</Button></div> : <><p>Send a request for <b>{product.title}</b> at the listed price of <b>₹{product.price}</b>?</p><textarea placeholder={`Hi ${product.seller}, is this still available?`} /><div className="modal-actions"><Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button><Button onClick={request}>Send request</Button></div></>}</Modal>}
  </main>;
}

function SellPage({ addProduct, navigate }: { addProduct: (p: Product) => void; navigate: (p: Page) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<string>(photos.desk);
  const [published, setPublished] = useState<Product | null>(null);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const form = e.currentTarget; const data = new FormData(form); const next: Record<string, string> = {};
    ["title", "description", "price"].forEach((k) => { if (!String(data.get(k) || "").trim()) next[k] = "This field is required."; });
    if (String(data.get("title")).trim().length > 0 && String(data.get("title")).trim().length < 3) next.title = "Use at least 3 characters.";
    if (String(data.get("description")).trim().length > 0 && String(data.get("description")).trim().length < 10) next.description = "Add at least 10 characters so buyers understand the item.";
    if (+String(data.get("price")) <= 0) next.price = "Enter a valid asking price.";
    if (+String(data.get("original")) > 0 && +String(data.get("original")) < +String(data.get("price"))) next.original = "Original price should not be below the asking price.";
    setErrors(next); if (Object.keys(next).length) return;
    const p: Product = { id: Date.now(), title: String(data.get("title")).trim(), price: +String(data.get("price")), original: +String(data.get("original")) || undefined, category: String(data.get("category")), condition: String(data.get("condition")) as Product["condition"], location: String(data.get("location")), seller: "Aarav S.", image: preview, description: String(data.get("description")).trim(), listed: "Just now", status: "Active" };
    addProduct(p); setPublished(p);
  };
  if (published) return <main className="page"><div className="publish-success"><span className="success-icon big"><Icon name="check" size={30} /></span><span className="eyebrow">LISTING PUBLISHED</span><h1>Your item has a new home on Campus Cart.</h1><p><b>{published.title}</b> is now visible to students around campus. This listing is stored locally for this prototype session.</p><div className="success-preview"><img src={published.image} alt="" /><div><Badge>{published.condition}</Badge><b>{published.title}</b><strong>₹{published.price}</strong></div></div><div><Button onClick={() => navigate("listings")}>View my listing</Button><Button variant="secondary" onClick={() => navigate("home")}>Back to marketplace</Button></div></div></main>;
  return <main className="page narrow-page"><div className="page-heading"><div><span className="eyebrow">SELL ON CAMPUS</span><h1>Give your item a new home.</h1><p>List it in a few simple steps and connect with someone who needs it.</p></div><span className="draft-pill">Stored locally on publish</span></div><form className="sell-layout" onSubmit={submit}><section className="form-card"><div className="form-section"><span className="section-number">01</span><div><h2>Item details</h2><p>Tell students exactly what you're offering.</p></div></div><Field label="Item title" error={errors.title}><input name="title" placeholder="e.g. Scientific calculator" /></Field><Field label="Category"><select name="category"><option>Books & Notes</option><option>Electronics</option><option>Lab Equipment</option><option>Hostel Essentials</option><option>Clothing & Fest Wear</option><option>Accessories</option></select></Field><Field label="Description" error={errors.description} hint="Include edition, size, what's included, and any visible wear."><textarea name="description" rows={5} placeholder="Describe the item honestly..." /></Field><div className="form-grid"><Field label="Asking price (₹)" error={errors.price}><input name="price" type="number" min="1" placeholder="450" /></Field><Field label="Original price (optional)" error={errors.original}><input name="original" type="number" min="1" placeholder="899" /></Field></div><Field label="Condition"><div className="condition-options">{["Like New", "Good", "Fair"].map((x) => <label key={x}><input type="radio" name="condition" value={x} defaultChecked={x === "Good"} /><span><b>{x}</b><small>{x === "Like New" ? "Barely used" : x === "Good" ? "Minor signs of use" : "Visible wear, works well"}</small></span></label>)}</div></Field><Field label="Campus / Hostel location"><select name="location"><option>Boys Hostel 7</option><option>Main Gate</option><option>Academic Block</option><option>Student Activity Centre</option></select></Field><Field label="Preferred contact method"><select><option>Campus Cart inquiry</option><option>Share college email after acceptance</option></select></Field></section><aside><section className="form-card"><div className="form-section small"><span className="section-number">02</span><div><h2>Add a photo</h2><p>A clear photo helps your item stand out.</p></div></div><label className="upload-area"><input type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const reader = new FileReader(); reader.onload = () => setPreview(String(reader.result)); reader.readAsDataURL(f); } }} /><span><Icon name="plus" /></span><b>Choose a product photo</b><small>JPG or PNG · Preview stays on your device</small></label>{preview !== photos.desk && <img className="upload-preview" src={preview} alt="Listing preview" />}</section><div className="sell-submit"><Button type="submit" className="full">Publish listing</Button><Button variant="ghost" className="full" onClick={() => navigate("home")}>Cancel</Button><small>Publishing creates a local demo listing. No backend storage is connected.</small></div></aside></form></main>;
}

function RentPage({ navigate, selectRental }: { navigate: (p: Page) => void; selectRental: (id: number) => void }) {
  const [category, setCategory] = useState("All");
  const categoryMap: Record<string, string> = { Calculators: "Electronics", "Lab equipment": "Lab Equipment" };
  const categories = ["All", "Lab equipment", "Calculators", "Festive clothing", "Cameras", "Sports", "Hostel essentials"];
  const visible = category === "All" ? rentals : rentals.filter((r) => r.category.toLowerCase() === (categoryMap[category] || category).toLowerCase());
  return <main className="page"><div className="rent-hero"><div><span className="eyebrow light">RENT ON CAMPUS</span><h1>Need it for a while?<br />Rent it.</h1><p>Access the things you need for exams, events and projects—without buying them permanently.</p></div><img src={photos.calculator} alt="Calculator available to rent" /></div><div className="rental-cats">{categories.map((x) => <button className={category === x ? "active" : ""} onClick={() => setCategory(x)} key={x}>{x}</button>)}</div><SectionTitle title="Available to rent" subtitle={`${visible.length} flexible campus rental${visible.length === 1 ? "" : "s"}`} />{visible.length ? <div className="rental-grid">{visible.map((r) => <article className="rental-card" key={r.id}><button className="rental-card-link" onClick={() => { selectRental(r.id); navigate("rental"); }} aria-label={`View ${r.title}`}><div className="rental-img"><img src={r.image} alt={r.title} /><Badge>Available</Badge></div></button><div><small>{r.category}</small><h3>{r.title}</h3><p><b>₹{r.price}</b> / {r.unit}</p><span>{r.condition} · {r.location}</span><div className="owner-row"><span className="mini-avatar">{r.seller[0]}</span> {r.seller}</div><Button variant="secondary" className="full" onClick={() => { selectRental(r.id); navigate("rental"); }}>View rental details</Button></div></article>)}</div> : <EmptyState icon="key" title="No rentals in this category" text="Try another category to see available demo rentals." action="Show all rentals" onAction={() => setCategory("All")} />}</main>;
}

function RentalDetails({ rental, addRequest, navigate }: { rental: typeof rentals[number]; addRequest: (r: RequestItem) => void; navigate: (p: Page) => void }) {
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [start, setStart] = useState(tomorrow);
  const [end, setEnd] = useState(new Date(Date.now() + 4 * 86400000).toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const days = Math.max(0, Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / 86400000) + 1);
  const units = rental.unit === "week" ? Math.ceil(days / 7) : days;
  const total = units * rental.price;
  useEffect(() => {
    if (start && end && new Date(end) < new Date(start)) setError("Return date must be after the start date.");
    else setError("");
  }, [start, end]);
  const submit = () => { if (!start || !end || days <= 0) { setError("Return date must be after the start date."); return; } addRequest({ id: Date.now(), item: rental.title, type: "Rental request", person: rental.seller, date: "Today", status: "Pending", image: rental.image }); setSuccess(true); };
  return <main className="page detail-page"><button className="back-link inline" onClick={() => navigate("rent")}><Icon name="arrow" size={18} /> Back to rentals</button><div className="rental-detail"><section><div className="gallery-main rental-main"><img src={rental.image} alt={rental.title} /></div><div className="detail-kickers"><Badge>Available</Badge><span>{rental.category}</span></div><h1>{rental.title}</h1><p className="lead">{rental.description}</p><div className="detail-block"><h3>Rental rules</h3><ul><li>Carry your student ID at pickup.</li><li>Return the item in the same condition.</li><li>Meet at the agreed public campus location.</li></ul></div></section><aside className="booking-card"><span className="eyebrow">RENTAL ESTIMATE</span><div className="rental-price"><b>₹{rental.price}</b> / {rental.unit}</div><div className="form-grid"><Field label="Start date"><input type="date" min={tomorrow} value={start} onChange={(e) => setStart(e.target.value)} /></Field><Field label="Return date" error={error}><input type="date" min={start || tomorrow} value={end} onChange={(e) => { setEnd(e.target.value); setError(""); }} /></Field></div><div className="cost-lines"><div><span>Duration</span><b>{days} {days === 1 ? "day" : "days"}</b></div><div><span>Rental cost</span><b>₹{total}</b></div><div><span>Refundable deposit</span><b>₹{rental.deposit}</b></div><div className="total"><span>Estimated due at pickup</span><b>₹{total + rental.deposit}</b></div></div>{success ? <div className="request-success"><Icon name="check" /><b>Rental request sent</b><p>The owner will review your dates. No booking or payment has occurred.</p><Button variant="secondary" onClick={() => navigate("requests")}>View request</Button></div> : <Button className="full" onClick={submit}>Request rental</Button>}<small className="demo-note">This is a demo estimate only and does not represent an actual booking or payment.</small><div className="owner-mini"><span className="avatar">{rental.seller.slice(0, 2)}</span><div><small>OWNER</small><b>{rental.seller}</b><span>{rental.location}</span></div></div></aside></div></main>;
}

function SwapPage({ navigate, selectSwap }: { navigate: (p: Page) => void; selectSwap: (id: number) => void }) {
  return <main className="page"><div className="swap-hero"><div><span className="eyebrow light">SMART SWAP</span><h1>Your unused item could be<br />someone else's favourite.</h1><p>Trade with fellow students instead of always spending money. Compare transparent demo values and propose a fair swap.</p><Button variant="secondary" onClick={() => navigate("proposal")}>Create a swap proposal</Button></div><div className="swap-visual"><div><img src={photos.book} alt="" /><b>Textbook</b><span>₹250 est.</span></div><span><Icon name="arrows" /></span><div><img src={photos.calculator} alt="" /><b>Calculator</b><span>₹300 est.</span></div></div></div><SectionTitle title="Open to swapping" subtitle="Items students are ready to trade" /><div className="swap-grid">{swaps.map((s) => <article className="swap-card" key={s.id}><img src={s.image} alt={s.title} /><div><Badge>{s.condition}</Badge><h3>{s.title}</h3><span className="est-value">Est. value <b>₹{s.value}</b></span><div className="looking-for"><small>LOOKING FOR</small><p>{s.wants}</p></div><div className="swap-owner"><span className="mini-avatar">{s.owner[0]}</span><span>{s.owner}<small>{s.location}</small></span></div><Button className="full" onClick={() => { selectSwap(s.id); navigate("proposal"); }}>Propose swap</Button></div></article>)}</div><p className="value-disclaimer">Estimated values are illustrative demo values based on listed price and condition—not an AI valuation.</p></main>;
}

function ProposalPage({ targetId, navigate, addRequest }: { targetId: number; navigate: (p: Page) => void; addRequest: (r: RequestItem) => void }) {
  const target = swaps.find((s) => s.id === targetId) || swaps[1];
  const ownItems = [{ title: "Engineering Mathematics Book", value: 250, condition: "Good", image: photos.book }, { title: "Everyday Backpack", value: 340, condition: "Good", image: photos.desk }];
  const [selected, setSelected] = useState(0);
  const [sent, setSent] = useState(false);
  const offered = ownItems[selected]; const difference = target.value - offered.value;
  const submit = () => { addRequest({ id: Date.now(), item: target.title, type: "Swap proposal", person: target.owner, date: "Today", status: "Pending", image: target.image }); setSent(true); };
  if (sent) return <main className="page"><div className="publish-success"><span className="success-icon big"><Icon name="arrows" size={30} /></span><span className="eyebrow">PROPOSAL SENT</span><h1>Your swap is now with {target.owner}.</h1><p>They'll be able to review both items and your message. No transaction has been completed.</p><div><Button onClick={() => navigate("requests")}>View my requests</Button><Button variant="secondary" onClick={() => navigate("swap")}>Back to swaps</Button></div></div></main>;
  return <main className="page narrow-page"><button className="back-link inline" onClick={() => navigate("swap")}><Icon name="arrow" size={18} /> Back to exchange</button><div className="page-heading"><div><span className="eyebrow">SWAP PROPOSAL</span><h1>Build a fair exchange.</h1><p>Pick what you'll offer, compare values, then send your proposal.</p></div></div><div className="proposal-layout"><section className="form-card"><div className="proposal-step"><span>1</span><div><h2>Select your item</h2><p>Choose one of your active listings.</p></div></div><div className="own-options">{ownItems.map((x, i) => <button className={selected === i ? "active" : ""} onClick={() => setSelected(i)} key={x.title}><img src={x.image} alt="" /><span><b>{x.title}</b><small>{x.condition} · Est. ₹{x.value}</small></span><i>{selected === i && <Icon name="check" size={15} />}</i></button>)}</div><div className="proposal-step"><span>2</span><div><h2>Compare the exchange</h2><p>Review the transparent value difference.</p></div></div><div className="compare"><div><small>YOU OFFER</small><img src={offered.image} alt="" /><b>{offered.title}</b><span>₹{offered.value} estimated</span></div><span className="compare-icon"><Icon name="arrows" /></span><div><small>YOU REQUEST</small><img src={target.image} alt="" /><b>{target.title}</b><span>₹{target.value} estimated</span></div></div><div className={`difference ${Math.abs(difference) <= 50 ? "fair" : ""}`}><div><b>Estimated value difference</b><span>Simple comparison of illustrative item values</span></div><strong>{difference > 0 ? "+" : ""}₹{difference}</strong></div><Field label="Message to the owner (optional)"><textarea rows={4} defaultValue={`Hi ${target.owner}, would you be interested in swapping your ${target.title} for my ${offered.title}?`} /></Field><Button className="full" onClick={submit}>Send swap proposal</Button></section><aside className="swap-explain"><h3>What happens next?</h3><ol><li><span>1</span><p><b>{target.owner} reviews your offer</b>They can accept, decline, or message you.</p></li><li><span>2</span><p><b>Agree on a campus handoff</b>Choose a safe public meeting point.</p></li><li><span>3</span><p><b>Inspect and exchange</b>Both students approve before completion.</p></li></ol><p>Values shown are illustrative estimates, not a scientifically validated valuation.</p></aside></div></main>;
}

function EmptyState({ icon, title, text, action, onAction }: { icon: string; title: string; text: string; action: string; onAction: () => void }) {
  return <div className="empty-state"><span><Icon name={icon} size={28} /></span><h2>{title}</h2><p>{text}</p><Button variant="secondary" onClick={onAction}>{action}</Button></div>;
}

function SavedPage({ products, saved, toggleSaved, openProduct, navigate }: { products: Product[]; saved: number[]; toggleSaved: (id: number) => void; openProduct: (id: number) => void; navigate: (p: Page) => void }) {
  const items = products.filter((p) => saved.includes(p.id));
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">YOUR SHORTLIST</span><h1>Saved items</h1><p>Everything you liked, kept in one place.</p></div><span className="count-pill">{items.length} saved</span></div>{items.length ? <div className="product-grid">{items.map((p) => <ProductCard key={p.id} product={p} saved toggleSaved={toggleSaved} onOpen={() => openProduct(p.id)} />)}</div> : <EmptyState icon="heart" title="Nothing saved yet" text="Tap the heart on any item to keep it here for later." action="Browse marketplace" onAction={() => navigate("buy")} />}</main>;
}

function RequestsPage({ requests, setRequests, navigate }: { requests: RequestItem[]; setRequests: (x: RequestItem[]) => void; navigate: (p: Page) => void }) {
  const [tab, setTab] = useState("All");
  const visible = tab === "All" ? requests : requests.filter((r) => r.type.startsWith(tab));
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">ACTIVITY</span><h1>My requests</h1><p>Track purchases, rentals and swaps in one place.</p></div></div><div className="tabs">{["All", "Buy", "Rental", "Swap"].map((x) => <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}</button>)}</div>{visible.length ? <div className="request-list">{visible.map((r) => <article key={r.id}><img src={r.image} alt="" /><div className="request-main"><span>{r.type}</span><h3>{r.item}</h3><p>With {r.person} · Submitted {r.date}</p></div><Badge tone={r.status === "Accepted" || r.status === "Completed" ? "green" : r.status === "Declined" ? "red" : "amber"}>{r.status}</Badge><div className="request-actions">{r.status === "Pending" && <Button variant="ghost" onClick={() => setRequests(requests.filter((x) => x.id !== r.id))}>Cancel</Button>}<Button variant="secondary" onClick={() => navigate("contact")}>Message</Button></div></article>)}</div> : <EmptyState icon="message" title="No requests here" text="Your buy requests, rentals and swap proposals will appear here." action="Explore marketplace" onAction={() => navigate("home")} />}</main>;
}

function ProfilePage({ navigate }: { navigate: (p: Page) => void }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "Aarav Sharma", year: "3rd year", location: "Boys Hostel 7" });
  const [draft, setDraft] = useState(profile);
  const save = () => {
    if (!draft.name.trim()) return;
    setProfile({ ...draft, name: draft.name.trim() });
    setEditing(false);
  };
  return <main className="page profile-page"><section className="profile-hero"><span className="avatar profile-avatar">AS</span><div><span className="eyebrow light">STUDENT PROFILE</span><h1>{profile.name}</h1><p>Computer Science Engineering · {profile.year}</p><span>BIT Sindri · {profile.location}</span></div><Button variant="secondary" onClick={() => { setDraft(profile); setEditing(true); }}>Edit profile</Button></section><div className="profile-grid"><section className="profile-card"><h2>Your Campus Cart</h2>{[{ i: "bag", l: "My listings", p: "listings", t: "Manage your active and completed listings" }, { i: "message", l: "My requests", p: "requests", t: "Track buys, rentals and swap proposals" }, { i: "heart", l: "Saved items", p: "saved", t: "Return to products you liked" }, { i: "bell", l: "Notifications", p: "notifications", t: "See recent activity and updates" }].map((x) => <button key={x.p} onClick={() => navigate(x.p as Page)}><span><Icon name={x.i} /></span><div><b>{x.l}</b><small>{x.t}</small></div><Icon name="chevron" /></button>)}</section><aside className="profile-card account-card"><h2>Account details</h2><dl><div><dt>College email</dt><dd>aarav.sharma@bitsindri.ac.in</dd></div><div><dt>Branch</dt><dd>Computer Science Engineering</dd></div><div><dt>Year</dt><dd>{profile.year}</dd></div><div><dt>Campus location</dt><dd>{profile.location}</dd></div></dl><p>Registration numbers and private contact details are never displayed publicly.</p><Button variant="ghost" onClick={() => navigate("landing")}>Log out</Button></aside></div>{editing && <Modal title="Edit profile" onClose={() => setEditing(false)}><div className="modal-form"><Field label="Display name" error={!draft.name.trim() ? "Display name is required." : undefined}><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field><Field label="Year of study"><select value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })}><option>1st year</option><option>2nd year</option><option>3rd year</option><option>4th year</option></select></Field><Field label="Campus location"><select value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })}><option>Boys Hostel 7</option><option>Girls Hostel</option><option>Day scholar</option></select></Field></div><div className="modal-actions"><Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={save} disabled={!draft.name.trim()}>Save changes</Button></div></Modal>}</main>;
}

function ListingsPage({ products, setProducts, navigate }: { products: Product[]; setProducts: (p: Product[]) => void; navigate: (p: Page) => void }) {
  const own = products.filter((p) => p.seller === "Aarav S.");
  const [confirm, setConfirm] = useState<number | null>(null);
  const [tab, setTab] = useState<"Active" | "Pending" | "Completed">("Active");
  const [editing, setEditing] = useState<Product | null>(null);
  const [editError, setEditError] = useState("");
  const visible = own.filter((p) => (p.status || "Active") === tab);
  const counts = { Active: own.filter((p) => (p.status || "Active") === "Active").length, Pending: own.filter((p) => p.status === "Pending").length, Completed: own.filter((p) => p.status === "Completed").length };
  const update = (id: number, changes: Partial<Product>) => setProducts(products.map((p) => p.id === id ? { ...p, ...changes } : p));
  const saveEdit = () => {
    if (!editing || !editing.title.trim() || editing.price <= 0) { setEditError("Enter a title and a valid price."); return; }
    update(editing.id, { title: editing.title.trim(), price: editing.price, status: editing.status || "Active" });
    setEditing(null);
    setEditError("");
  };
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">SELLER DASHBOARD</span><h1>My listings</h1><p>Manage the items you've shared with campus.</p></div><Button icon="plus" onClick={() => navigate("sell")}>List another item</Button></div><div className="tabs">{(["Active", "Pending", "Completed"] as const).map((x) => <button key={x} className={tab === x ? "active" : ""} onClick={() => setTab(x)}>{x === "Completed" ? "Sold / Completed" : x} <span>{counts[x]}</span></button>)}</div>{visible.length ? <div className="manage-list">{visible.map((p) => <article key={p.id}><img src={p.image} alt="" /><div><Badge tone={tab === "Completed" ? "gray" : tab === "Pending" ? "amber" : "green"}>{tab}</Badge><h3>{p.title}</h3><p>₹{p.price} · Listed {p.listed}</p></div><Button variant="secondary" onClick={() => { setEditing({ ...p, status: p.status || "Active" }); setEditError(""); }}>Edit</Button>{tab === "Active" && <Button variant="ghost" onClick={() => update(p.id, { status: "Completed" })}>Mark unavailable</Button>}<button className="delete-btn" onClick={() => setConfirm(p.id)} aria-label={`Delete ${p.title}`}><Icon name="trash" /></button></article>)}</div> : <EmptyState icon="bag" title={`No ${tab.toLowerCase()} listings`} text={tab === "Active" ? "Pass on something you no longer need and help another student." : "Listings with this status will appear here."} action={tab === "Active" ? "Create a listing" : "View active listings"} onAction={() => tab === "Active" ? navigate("sell") : setTab("Active")} />}{editing && <Modal title="Edit listing" onClose={() => setEditing(null)}><div className="modal-form"><Field label="Item title" error={editError}><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></Field><Field label="Asking price (₹)"><input type="number" min="1" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} /></Field><Field label="Status"><select value={editing.status || "Active"} onChange={(e) => setEditing({ ...editing, status: e.target.value as Product["status"] })}><option>Active</option><option>Pending</option><option>Completed</option></select></Field></div><div className="modal-actions"><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={saveEdit}>Save changes</Button></div></Modal>}{confirm && <Modal title="Delete this listing?" onClose={() => setConfirm(null)}><p>This removes the item from your local demo marketplace. This action cannot be undone.</p><div className="modal-actions"><Button variant="ghost" onClick={() => setConfirm(null)}>Keep listing</Button><Button variant="danger" onClick={() => { setProducts(products.filter((p) => p.id !== confirm)); setConfirm(null); }}>Delete listing</Button></div></Modal>}</main>;
}

function NotificationsPage({ navigate }: { navigate: (p: Page) => void }) {
  const [notes, setNotes] = useState([{ title: "Your rental request was accepted", text: "Ishaan accepted your request for the DSLR Camera Kit.", time: "12 min ago", tone: "green", read: false }, { title: "New swap proposal", text: "Riya wants to trade for your Engineering Mathematics Book.", time: "2 hours ago", tone: "amber", read: false }, { title: "Listing published", text: "Your new listing is visible to students around campus.", time: "Yesterday", tone: "green", read: true }]);
  const open = (title: string) => {
    setNotes(notes.map((n) => n.title === title ? { ...n, read: true } : n));
    navigate("requests");
  };
  return <main className="page narrow-page"><div className="page-heading"><div><span className="eyebrow">UPDATES</span><h1>Notifications</h1><p>Sample activity from your Campus Cart account.</p></div><button className="text-button" disabled={notes.every((n) => n.read)} onClick={() => setNotes(notes.map((n) => ({ ...n, read: true })))}>Mark all as read</button></div><div className="notification-list">{notes.map((n) => <button className={n.read ? "read" : ""} key={n.title} onClick={() => open(n.title)}><span className={`note-icon ${n.tone}`}><Icon name={n.tone === "green" ? "check" : "arrows"} /></span><div><b>{n.title}</b><p>{n.text}</p><small>{n.time}</small></div>{!n.read && <i />}</button>)}</div></main>;
}

function ContactPage({ product, navigate }: { product: Product; navigate: (p: Page) => void }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [report, setReport] = useState<string | null>(null);
  const [reportSent, setReportSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = String(new FormData(e.currentTarget).get("message") || "").trim();
    if (message.length < 10) { setError("Add a message of at least 10 characters."); return; }
    setError("");
    setSent(true);
  };
  return <main className="page narrow-page"><button className="back-link inline" onClick={() => navigate("product")}><Icon name="arrow" /> Back to item</button><div className="contact-layout"><section><span className="eyebrow">SAFE COORDINATION</span><h1>Contact {product.seller}</h1><p>Send an inquiry without exposing private contact details.</p><div className="contact-product"><img src={product.image} alt="" /><div><small>ABOUT THIS ITEM</small><b>{product.title}</b><span>₹{product.price} · {product.location}</span></div></div>{sent ? <div className="request-success larger"><Icon name="check" /><h2>Inquiry sent</h2><p>{product.seller} will see your message in their simulated inbox. No private contact details were shared.</p><Button onClick={() => navigate("requests")}>Go to requests</Button></div> : <form onSubmit={submit}><Field label="Suggested meeting location"><select><option>Main Library entrance</option><option>Student Activity Centre</option><option>Academic Block lobby</option><option>Main Gate security desk</option></select></Field><Field label="Message" error={error}><textarea name="message" rows={6} defaultValue={`Hi ${product.seller}, I'm interested in ${product.title}. Is it still available?`} onChange={() => setError("")} /></Field><Button type="submit">Send inquiry</Button></form>}</section><aside className="safety-panel"><h2>Meet safely on campus</h2><ul><li>Choose a well-lit public location.</li><li>Inspect the item before agreeing.</li><li>Do not share private room numbers.</li><li>Bring a friend when possible.</li></ul><button onClick={() => setReport("Report user")}>Report user</button><button onClick={() => setReport("Report listing")}>Report listing</button><p>No phone number, private email, or payment is shared through this prototype.</p></aside></div>{report && <Modal title={reportSent ? "Report recorded" : report} onClose={() => { setReport(null); setReportSent(false); }}>{reportSent ? <div className="modal-success"><span className="success-icon"><Icon name="check" /></span><p>Your demo report was recorded locally. No report was sent to a backend.</p><Button onClick={() => { setReport(null); setReportSent(false); }}>Done</Button></div> : <><Field label="Reason"><select><option>Unsafe behavior</option><option>Misleading information</option><option>Spam</option><option>Other concern</option></select></Field><Field label="Additional details"><textarea rows={4} placeholder="Optional context for the report" /></Field><div className="modal-actions"><Button variant="ghost" onClick={() => setReport(null)}>Cancel</Button><Button onClick={() => setReportSent(true)}>Submit demo report</Button></div></>}</Modal>}</main>;
}

function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose}><Icon name="close" /></button></div>{children}</div></div>;
}

export default function App() {
  const hashPage = window.location.hash.replace("#", "") as Page;
  const initialPage = (window.history.state?.page as Page) || (hashPage || "landing");
  const [page, setPage] = useState<Page>(initialPage);
  const [products, setProducts] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem("campus-products") || "null") || initialProducts; } catch { return initialProducts; }
  });
  const [saved, setSaved] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("campus-saved") || "[]"); } catch { return []; }
  });
  const [requests, setRequests] = useState<RequestItem[]>(() => {
    const defaults: RequestItem[] = [
      { id: 900, item: "DSLR Camera Kit", type: "Rental request", person: "Ishaan G.", date: "Yesterday", status: "Accepted", image: photos.night },
      { id: 901, item: "Applied Physics Textbook", type: "Swap proposal", person: "Riya S.", date: "2 days ago", status: "Pending", image: photos.book },
    ];
    try { return JSON.parse(localStorage.getItem("campus-requests") || "null") || defaults; } catch { return defaults; }
  });
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(1);
  const [selectedRental, setSelectedRental] = useState(101);
  const [selectedSwap, setSelectedSwap] = useState(202);
  const [toast, setToast] = useState("");
  useEffect(() => { localStorage.setItem("campus-products", JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem("campus-saved", JSON.stringify(saved)); }, [saved]);
  useEffect(() => { localStorage.setItem("campus-requests", JSON.stringify(requests)); }, [requests]);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const pop = (e: PopStateEvent) => setPage((e.state?.page as Page) || "landing");
    window.addEventListener("popstate", pop); return () => window.removeEventListener("popstate", pop);
  }, []);
  const navigate = (next: Page) => { setPage(next); window.history.pushState({ page: next }, "", `#${next}`); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const openProduct = (id: number) => { setSelectedProduct(id); navigate("product"); };
  const toggleSaved = (id: number) => setSaved((s) => {
    const removing = s.includes(id);
    setToast(removing ? "Removed from saved items" : "Saved for later");
    return removing ? s.filter((x) => x !== id) : [...s, id];
  });
  const product = products.find((p) => p.id === selectedProduct) || products[0] || initialProducts[0];
  const rental = rentals.find((r) => r.id === selectedRental) || rentals[0];
  const marketProducts = products.filter((p) => !p.status || p.status === "Active");
  const publicPages: Page[] = ["landing", "login", "register"];
  let content: ReactNode;
  switch (page) {
    case "landing": content = <Landing navigate={navigate} />; break;
    case "login": content = <AuthPage mode="login" navigate={navigate} />; break;
    case "register": content = <AuthPage mode="register" navigate={navigate} />; break;
    case "home": content = <Home products={marketProducts} saved={saved} toggleSaved={toggleSaved} openProduct={openProduct} navigate={navigate} query={query} setQuery={setQuery} />; break;
    case "buy": content = <BuyPage products={marketProducts} saved={saved} toggleSaved={toggleSaved} openProduct={openProduct} query={query} setQuery={setQuery} />; break;
    case "product": content = <ProductDetails product={product} saved={saved.includes(product.id)} toggleSaved={toggleSaved} navigate={navigate} addRequest={(r) => setRequests((x) => [r, ...x])} />; break;
    case "sell": content = <SellPage addProduct={(p) => setProducts((x) => [p, ...x])} navigate={navigate} />; break;
    case "rent": content = <RentPage navigate={navigate} selectRental={setSelectedRental} />; break;
    case "rental": content = <RentalDetails rental={rental} addRequest={(r) => setRequests((x) => [r, ...x])} navigate={navigate} />; break;
    case "swap": content = <SwapPage navigate={navigate} selectSwap={setSelectedSwap} />; break;
    case "proposal": content = <ProposalPage targetId={selectedSwap} navigate={navigate} addRequest={(r) => setRequests((x) => [r, ...x])} />; break;
    case "saved": content = <SavedPage products={products} saved={saved} toggleSaved={toggleSaved} openProduct={openProduct} navigate={navigate} />; break;
    case "requests": content = <RequestsPage requests={requests} setRequests={setRequests} navigate={navigate} />; break;
    case "profile": content = <ProfilePage navigate={navigate} />; break;
    case "listings": content = <ListingsPage products={products} setProducts={setProducts} navigate={navigate} />; break;
    case "notifications": content = <NotificationsPage navigate={navigate} />; break;
    case "contact": content = <ContactPage product={product} navigate={navigate} />; break;
    default: content = <Home products={marketProducts} saved={saved} toggleSaved={toggleSaved} openProduct={openProduct} navigate={navigate} query={query} setQuery={setQuery} />;
  }
  if (publicPages.includes(page)) return content;
  return <div className="app-shell"><Header page={page} navigate={navigate} query={query} setQuery={setQuery} savedCount={saved.length} />{content}<BottomNav page={page} navigate={navigate} />{toast && <Toast message={toast} />}<div className="mobile-safe-space" /></div>;
}
