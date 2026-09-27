import { ImageResponse } from 'next/og';
export const alt = 'Elarven — A little further from ordinary';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        background: '#202c2b',
        color: '#f8f7f3',
        padding: '70px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 36 }}>
        <span>elarven</span>
        <span style={{ fontSize: 18, letterSpacing: 3 }}>EXCEPTIONAL STAYS</span>
      </div>
      <div style={{ display: 'flex', fontSize: 86, lineHeight: 1.08, maxWidth: 900 }}>
        A little further from ordinary.
      </div>
      <div
        style={{ display: 'flex', borderTop: '1px solid #65726a', paddingTop: 28, fontSize: 22 }}
      >
        The Alps. The coast. The desert. The forest.
      </div>
    </div>,
    size,
  );
}
