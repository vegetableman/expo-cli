import NextDocument from 'next/document';
export declare const style = "\n/**\n * Building on the RNWeb reset:\n * https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/StyleSheet/initialRules.js\n */\nhtml, body, #__next {\n  width: 100%;\n  /* To smooth any scrolling behavior */\n  -webkit-overflow-scrolling: touch;\n  margin: 0px;\n  padding: 0px;\n  /* Allows content to fill the viewport and go beyond the bottom */\n  min-height: 100%;\n}\n#__next {\n  flex-shrink: 0;\n  flex-basis: auto;\n  flex-grow: 1;\n  display: flex;\n  flex: 1;\n}\nhtml {\n  scroll-behavior: smooth;\n  /* Prevent text size change on orientation change https://gist.github.com/tfausak/2222823#file-ios-8-web-app-html-L138 */\n  -webkit-text-size-adjust: 100%;\n  height: 100%;\n}\nbody {\n  display: flex;\n  /* Allows you to scroll below the viewport; default value is visible */\n  overflow-y: auto;\n  overscroll-behavior-y: none;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  -ms-overflow-style: scrollbar;\n}\n";
export declare function getInitialProps({ renderPage }: {
    renderPage: any;
}): Promise<any>;
export declare class Document extends NextDocument {
    render(): any;
}
