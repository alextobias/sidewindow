import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-csharp";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-haskell";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-perl";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-ruby";
import "ace-builds/src-noconflict/mode-rust";
import "ace-builds/src-noconflict/mode-sass";
import "ace-builds/src-noconflict/mode-scala";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-xml";
import "ace-builds/src-noconflict/mode-yaml";

import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-tomorrow";
import "ace-builds/src-noconflict/theme-kuroir";
import "ace-builds/src-noconflict/theme-twilight";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-terminal";

const editorLanguages = ["c_cpp", "c_csharp", "css", "golang", "haskell", "html", "java", "javascript", "json", "latex", "markdown", "perl", "php", "python", "ruby", "rust", "sass", "scala", "text", "typescript", "xml", "yaml"]
const defaultEditorLanguage = "markdown"

const editorThemes = ["dracula", "monokai", "github", "tomorrow", "kuroir", "twilight", "xcode", "textmate", "solarized_dark", "solarized_light", "terminal"]
const defaultEditorTheme = "twilight"

const editorFontSizes = Array.from(Array(21).keys()).map((n) => n + 10)
const defaultEditorFontSize = 16;

export {editorLanguages, editorThemes, editorFontSizes, defaultEditorLanguage, defaultEditorTheme, defaultEditorFontSize};