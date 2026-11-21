import React, { Suspense, lazy, useCallback, useEffect, useState } from "react";
import profilePhoto from "../asset/lanyard-character.jpg";
import schoolLogo from "../asset/LOGO SMK METLAND.png";

const Lanyard = lazy(() => import("./components/Lanyard.jsx"));

const xmlEscape = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function createCardArtwork(photo, logo) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="1125" viewBox="0 0 800 1125">
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M30 0H0V30" fill="none" stroke="#17304f" stroke-opacity=".08" stroke-width="1"/>
        </pattern>
        <clipPath id="photo-crop">
          <rect x="58" y="330" width="684" height="540"/>
        </clipPath>
      </defs>
      <rect width="800" height="1125" fill="#f0ebdc"/>
      <rect width="800" height="1125" fill="url(#grid)"/>
      <rect x="20" y="18" width="760" height="1089" rx="20" fill="none" stroke="#192a42" stroke-width="3"/>
      <rect x="40" y="42" width="720" height="112" rx="8" fill="#e2ddcf" stroke="#192a42" stroke-width="2"/>
      <image href="${logo}" x="56" y="58" width="78" height="78" preserveAspectRatio="xMidYMid meet"/>
      <text x="150" y="88" fill="#192a42" font-family="sans-serif" font-size="30" font-weight="800" letter-spacing=".3">METLAND</text>
      <text x="152" y="119" fill="#48556a" font-family="sans-serif" font-size="20" font-weight="600" letter-spacing="1">SCHOOL / CIBITUNG</text>
      <rect x="638" y="60" width="104" height="52" rx="4" fill="#192a42"/>
      <text x="690" y="94" text-anchor="middle" fill="#f0ebdc" font-family="sans-serif" font-size="24" font-weight="700" letter-spacing="1">PPLG</text>
      <path d="M54 174h692" stroke="#192a42" stroke-opacity=".35" stroke-width="2"/>
      <text x="54" y="218" fill="#315da7" font-family="sans-serif" font-size="28" font-weight="800" letter-spacing="4">JUNIOR</text>
      <text x="48" y="304" fill="#192a42" font-family="sans-serif" font-size="96" font-weight="900" letter-spacing="-4">DEVELOPER</text>
      <rect x="48" y="320" width="704" height="560" rx="8" fill="#fffdf7" stroke="#192a42" stroke-width="3"/>
      <image href="${photo}" x="58" y="330" width="684" height="540" preserveAspectRatio="xMidYMin slice" clip-path="url(#photo-crop)"/>
      <path d="M54 916h692" stroke="#192a42" stroke-opacity=".35" stroke-width="2"/>
      <text x="54" y="964" fill="#192a42" font-family="sans-serif" font-size="38" font-weight="800" letter-spacing=".4">DAFFA MAULANA MUZAKY</text>
      <text x="54" y="1003" fill="#315da7" font-family="sans-serif" font-size="26" font-weight="700" letter-spacing=".8">SOFTWARE ENGINEERING</text>
      <text x="744" y="1003" text-anchor="end" fill="#192a42" font-family="sans-serif" font-size="26" font-weight="700">FULLSTACK DEVELOPER</text>
      <rect x="48" y="1024" width="704" height="70" rx="5" fill="#192a42"/>
      <text x="68" y="1073" fill="#f0ebdc" font-family="sans-serif" font-size="54" font-weight="900" letter-spacing="-1">PORTFOLIO</text>
      <text x="730" y="1069" text-anchor="end" fill="#d2d9e5" font-family="monospace" font-size="24" font-weight="600" letter-spacing="1">METLAND / PPLG</text>
    </svg>`;
}

function createStrapArtwork() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="192" viewBox="0 0 1024 192">
      <defs>
        <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M0 1h8M0 5h8" stroke="#c8d5e5" stroke-opacity=".07"/>
          <path d="M2 0v8M6 0v8" stroke="#000" stroke-opacity=".28"/>
        </pattern>
      </defs>
      <rect width="1024" height="192" fill="#111a28"/>
      <rect width="1024" height="192" fill="url(#weave)"/>
      <path d="M12 0v192M1012 0v192" stroke="#8292a8" stroke-opacity=".5" stroke-dasharray="8 8" stroke-width="3"/>
      <text x="30" y="125" fill="#d5deea" font-family="Arial, sans-serif" font-size="58" font-weight="600" letter-spacing="7">DAFFA  •  DEVELOPER</text>
    </svg>`;
}

function createImageUrl(svg) {
  return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
}

async function loadImageDataUrl(src) {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Could not load lanyard artwork image (${response.status}).`);

  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not encode a lanyard artwork image."));
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read a lanyard artwork image."));
    reader.readAsDataURL(blob);
  });
}

export default function PortfolioLanyard() {
  const [artwork, setArtwork] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let urls = [];

    Promise.all([loadImageDataUrl(profilePhoto), loadImageDataUrl(schoolLogo)])
      .then(([photo, logo]) => {
        if (cancelled) return;

        urls = [
          createImageUrl(createCardArtwork(xmlEscape(photo), xmlEscape(logo))),
          createImageUrl(createStrapArtwork()),
        ];
        setArtwork({ card: urls[0], strap: urls[1] });
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Could not load React Bits Lanyard artwork.", error);
          setFailed(true);
        }
      });

    return () => {
      cancelled = true;
      urls.forEach(URL.revokeObjectURL);
    };
  }, []);

  const handleError = useCallback((error) => {
    console.error("React Bits Lanyard failed to initialize.", error);
    setFailed(true);
  }, []);
  const handleReady = useCallback(() => setFailed(false), []);

  return (
    <div
      className="portfolio-lanyard"
      role="img"
      aria-label="Kartu identitas Daffa Maulana Muzaky, Junior Developer, Metland School Cibitung."
    >
      {artwork && (
        <Suspense fallback={<img className="portfolio-lanyard-fallback" src={artwork.card} alt="" />}>
          <Lanyard
            frontImage={artwork.card}
            backImage={artwork.card}
            imageFit="contain"
            cardColor="#f5f0df"
            finish="glossy"
            size={0.86}
            strapLength={0.66}
            strapImage={artwork.strap}
            strapColor="#11141b"
            strapWidth={0.56}
            metal="silver"
            gravity={1}
            damping={0.46}
            elasticity={0.45}
            breeze={0.22}
            interactive
            intro={false}
            className="portfolio-lanyard-canvas"
            onReady={handleReady}
            onError={handleError}
          />
        </Suspense>
      )}
      {failed && artwork && <img className="portfolio-lanyard-fallback" src={artwork.card} alt="" />}
      {failed && !artwork && <img className="portfolio-lanyard-fallback" src={profilePhoto} alt="" />}
    </div>
  );
}
