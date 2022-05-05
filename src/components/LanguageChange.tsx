import {useTranslation} from "react-i18next";

export default function LanguageChange() {
    const {t, i18n} = useTranslation();
    const changeLanguage = async (lang: string) => {
        await i18n.changeLanguage(lang);
    }

    return (
        <div className="language-change ml-auto">
            <select defaultValue={i18n.language} className="w-full flex-none block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md" onChange={(e) => changeLanguage(e.target.value)}>
                <option value="en-US">English</option>
            </select>
        </div>
    )
}