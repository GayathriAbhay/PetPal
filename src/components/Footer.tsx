const Footer = () => {
  return (
    <footer className="border-t border-border mt-16 py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} PetPal. All rights reserved.</div>
        <div className="text-sm text-muted-foreground mt-3 md:mt-0">Built by Group 5 — Anu Raphel, Diya Martin, Gayathri A Menon</div>
      </div>
    </footer>
  );
};

export default Footer;
