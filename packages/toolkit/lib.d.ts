declare module '*.png';
declare module '*.gif';
declare module '*.css';
declare module '*.svg';
declare module '*.less' {
  const content: Record<string, string>;
  export default content;
}
