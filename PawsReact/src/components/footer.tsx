import React from "react";

interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  sections: FooterSection[];
  developers?: string[];
}

const Footer: React.FC<FooterProps> = ({ sections, developers }) => {
  return (
    <footer className="bg-selective-yellow text-prussian-blue py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold mb-4">{section.title}</h3>
              <ul>
                {section.links.map((link, idx) => (
                  <li key={idx} className="mb-2">
                    <a href={link.href} className="hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-prussian-blue pt-8 text-center space-y-1">
          {developers && (
            <p className="text-sm">
              Proyecto desarrollado por: {developers.join(" - ")}
            </p>
          )}
          <p className="text-sm">
            Todos los derechos reservados &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;