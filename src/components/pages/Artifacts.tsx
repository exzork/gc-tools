import {ChangeEvent, useEffect, useState} from "react";
import ReliquaryDataProvider, {IReliquaryAffix, IReliquaryMain} from "../providers/ReliquaryDataProvider";
import {Autocomplete, Chip, createFilterOptions, TextField} from "@mui/material";
import {permutations} from "mathjs";
//@ts-ignore
import _ from "lodash";
import {useTranslation} from "react-i18next";

interface IArtifact {
    id: number;
    name: string;
}


interface IPropTypeValues {
    [key: string]: number[]; //number is the values
}

interface ISelectedPropTypeValues {
    [key: string]: number[]; //number is the ids
}

export default function Artifacts() {
    const [reliquaryMains, setReliquaryMains] = useState<IReliquaryMain[]>([]);
    const [reliquaryAffixes, setReliquaryAffixes] = useState<IReliquaryAffix[]>([]);
    const [uid, setUid] = useState(0);
    const [selectedArtifact, setSelectedArtifact] = useState(0);
    const [selectedMainStat, setSelectedMainStat] = useState(0);
    const [artifactEnhancements, setArtifactEnhancements] = useState(0);
    const [affixesValues, setAffixesValues] = useState<IPropTypeValues>({});
    const [selectedAffixesValues, setSelectedAffixesValues] = useState<ISelectedPropTypeValues>({});

    const {t} = useTranslation("artifact");

    const [artifactData, setArtifactData] = useState<IArtifact[]>([]);
    const [generatedArtifact, setGeneratedArtifact] = useState("/giveart ");

    useEffect(() => {
        const dataArtifact: IArtifact[] = [];
        const initReliquaryData = async () => {
            await ReliquaryDataProvider.init();
            setReliquaryMains(ReliquaryDataProvider.getReliquaryMains());
            setReliquaryAffixes(ReliquaryDataProvider.getReliquaryAffixes());
        };
        fetch("https://gist.githubusercontent.com/exzork/0c5ab10f35f6aa718735380d8ce585db/raw/bc14a3f87f3a49aa053a43db999d04a8f09dcd71/GM%2520Handbook.txt")
            .then(res => res.text())
            .then(text => {
                const lines = text.split("\n");
                lines.forEach(line => {
                    const lineSplit = line.split(" : ");
                    if (lineSplit.length === 2) {
                        const id = parseInt(lineSplit[0]);
                        const name = lineSplit[1];
                        if ((id >= 23341 && id <= 30000) || (id >= 51110 && id <= 99554)) {
                            if (dataArtifact.filter((x) => x.name === lineSplit[1]).length === 0) {
                                dataArtifact.push({id: id, name: name});
                            }
                        }
                    }
                });
                setArtifactData(dataArtifact);
                initReliquaryData();
            });

        fetch("https://github.com/impact-moe/impact-api/wiki/Artifacts").then(res => res.json())
            .then(data => {
                console.log(data);
            });
    }, []);

    useEffect(() => {
        const av: IPropTypeValues = getPropTypeValues(reliquaryAffixes);
        setAffixesValues(av);
    }, [reliquaryAffixes]);

    useEffect(() => {
        handleGeneratedArtifact()
    }, [uid, selectedArtifact, selectedMainStat, selectedAffixesValues, artifactEnhancements]);

    const handleArtifactChange = (event: any, value: any) => {
        if (value !== null) {
            setSelectedArtifact(value.id);
        }
    };

    const handleMainStatChange = (event: any, value: any) => {
        if (value !== null) {
            setSelectedMainStat(value.Id);
        }
    };

    const getAffixIdByPropTypeAndPropValue = (propType: string, propValue: number) => {
        return reliquaryAffixes.filter((x) => x.PropType === propType && x.PropValue === propValue)[0].Id;
    };

    const getListOfIdsByPropTypeAndRequestValue = (affixName: string, requestValue: number) => {
        const possibleValues = affixesValues[affixName];

        let ids: number[] = [];
        let closestValue = 0;
        let less: number[] = [];

        possibleValues.forEach((value) => {
            if (value <= requestValue) {
                less.push(value);
            }
        });

        less.sort();
        less.reverse();

        for (let i of less) {
            while ((closestValue + i) <= requestValue) {
                closestValue += i;
                const id = getAffixIdByPropTypeAndPropValue(affixName, i);
                if (id !== undefined) {
                    ids.push(id);
                }
            }
            if (closestValue === requestValue) break;
        }
        return {ids, closestValue};
    }

    const handleAffixChange = (event: ChangeEvent<HTMLInputElement>, affixName: string) => {
        let affixesSelected = {...selectedAffixesValues};
        const affixValues = parseInt(event.target.value);
        if (affixValues > 0) {
            if (affixesSelected[affixName] === undefined) affixesSelected[affixName] = [];
            if (affixName.indexOf("PERCENT") !== -1 || affixName.indexOf("CRITICAL") !== -1 || affixName.indexOf("EFFICIENCY") !== -1 || affixName.indexOf("HURT") !== -1 || affixName.indexOf("RATIO") !== -1 || affixName.indexOf("ADD") !== -1) {
                const {ids} = getListOfIdsByPropTypeAndRequestValue(affixName, affixValues / 100);
                affixesSelected[affixName] = ids;
            } else {
                const {ids} = getListOfIdsByPropTypeAndRequestValue(affixName, affixValues);
                affixesSelected[affixName] = ids;
            }
        } else {
            delete affixesSelected[affixName];
        }
        setSelectedAffixesValues(affixesSelected);
    };

    const handleGetAffixClosestValue = (event: ChangeEvent<HTMLInputElement>, affixName: string) => {
        const affixValues = parseInt(event.target.value);
        if (affixValues === 0) return;
        const {closestValue} = getListOfIdsByPropTypeAndRequestValue(affixName, affixValues);
        event.target.value = parseFloat(closestValue.toFixed(3)).toString();
    }


    const getPropTypeValues = (affixes: IReliquaryAffix[]) => {
        let propTypeValues: IPropTypeValues = {};
        affixes.forEach(affix => {
            if (propTypeValues[affix.PropType] === undefined) {
                propTypeValues[affix.PropType] = [];
            }
            if (affix.PropValue > 0) propTypeValues[affix.PropType].push(affix.PropValue);
        });
        return propTypeValues;
    };

    const handleGeneratedArtifact = () => {
        let selectedAffixesCombine: (string | number)[] = [];
        if (Object.keys(selectedAffixesValues).length > 0) {
            Object.keys(selectedAffixesValues).forEach(affixName => {
                const affixValues = selectedAffixesValues[affixName];
                const distinctValues = Array.from(new Set(affixValues));
                distinctValues.forEach(value => {
                    const countAffixes = affixValues.filter(x => x === value).length;
                    if (countAffixes > 1) selectedAffixesCombine.push(value + "," + countAffixes);
                    else selectedAffixesCombine.push(value);
                })
            })
        }
        const generated = "/giveart @" + uid + " " + selectedArtifact + " " + selectedMainStat + " " + selectedAffixesCombine.join(" ") + " " + Number(artifactEnhancements + 1);
        setGeneratedArtifact(generated);
    };
    const generateImageUrl = (artifactName:string)=>{
        let url = "https://impact.moe/assets/img/artifact-icons/";
        let artifactNameLower = artifactName.toLowerCase();
        artifactNameLower = artifactNameLower.replaceAll("'", "");
        artifactNameLower = artifactNameLower.replaceAll(" ", "-");
        if (artifactNameLower === "wanderers-string-kettle") artifactNameLower = "wanderings-string-kettle";
        return url + artifactNameLower + ".webp";
    }
    return (
        <form method="POST" className="space-y-8 divide-y divide-gray-200 bg-white p-10">
            <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                    <div>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">{t('fill_details')}</p>
                    </div>
                    <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <div
                            className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="name"
                                   className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                {t("uid")}
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="text" aria-label="UID" name="uid" id="uid"
                                       className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                       onChange={(event) => setUid(parseInt(event.target.value))}/>
                            </div>
                        </div>
                        <div
                            className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="description"
                                   className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                                {t('name')}
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <Autocomplete
                                    aria-label="Artifact Name" id="ArtifactName"
                                    className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                    options={artifactData}
                                    getOptionLabel={(option) => t(option.name)}
                                    onChange={handleArtifactChange}
                                    renderInput={(params) => {
                                        return <TextField {...params} label="Artifact Name" variant="outlined"/>
                                    }}
                                    renderOption={(option, {name}) => {
                                        return <li {...option}>
                                            <img src={generateImageUrl(name)} alt={""} className="inline-block h-8 w-8 rounded-full"
                                                 style={{marginRight: '10px'}}/>
                                            <span className="ml-2">{t(name)}</span>
                                        </li>
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="image"
                                   className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2">
                                {t('main_stats')}
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <div
                                    className="relative h-10 rounded-lg flex justify-center items-center">
                                    <Autocomplete
                                        aria-label="Artifact Main Stats" id="ArtifactMainStats"
                                        className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                        options={reliquaryMains}
                                        getOptionLabel={(option) => t(option.PropType)}
                                        onChange={handleMainStatChange}
                                        renderInput={(params) => <TextField {...params} label="Main Stats"
                                                                            variant="outlined"/>}
                                    />
                                </div>
                            </div>
                        </div>
                        <div
                            className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="start_date"
                                   className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                                {t('sub_stats')}
                            </label>
                            <div
                                className="mt-1 sm:mt-0 sm:col-span-2 h-48 overflow-auto grid gap-x-10 gap-y-2 grid-cols-2">
                                {Object.keys(affixesValues).map((key, index) => {
                                    return (
                                        <div key={index} className="flex items-center mt-1">
                                            <div className="ml-3 flex-grow ">
                                                <div className="text-sm leading-5 text-gray-900">
                                                    {t(key)}
                                                </div>
                                            </div>
                                            <div className="ml-auto flex-none">
                                                <input type="number"
                                                       step={0.01}
                                                       className="block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                                       id={key}
                                                       defaultValue={0}
                                                       onChange={(e) => handleAffixChange(e, key)}
                                                       onBlur={(e) => handleGetAffixClosestValue(e, key)}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div
                            className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <label htmlFor="start_date"
                                   className="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2">
                                {t('enhancement_level')}
                            </label>
                            <div className="mt-1 sm:mt-0 sm:col-span-2">
                                <input type="number" defaultValue="1" min="1" max="20"
                                       className="w-full flex-none block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                       onChange={(e) => setArtifactEnhancements(Number(e.currentTarget.value))}/>
                            </div>
                        </div>
                        <div className="block sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
                            <input type="text" onClick={(e) => {
                                navigator.clipboard.writeText(e.currentTarget.value)
                            }}
                                   className="block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
                                   value={generatedArtifact} readOnly/>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}