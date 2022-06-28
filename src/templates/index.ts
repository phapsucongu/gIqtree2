import findModel from './findModel';
import mergePartitions from './mergePartitions';
import inferTree from './inferTree';
import assessSupport from './assessSupport';
import dateTree from './dateTree';

import base from './default';
import { Settings } from '../interfaces';
import { merge } from 'merge-anything';

export enum TemplateType {
    FindModel = 1,
    MergePartitions,
    InferTree,
    AssessSupport,
    DateTree
}


export function getTemplateSettings(type?: TemplateType) : Settings {
    let def = base();
    switch (type) {
        case TemplateType.FindModel:
            return merge(def, findModel());
        case TemplateType.MergePartitions:
            return merge(def, mergePartitions());
        case TemplateType.InferTree:
            return merge(def, inferTree());
        case TemplateType.AssessSupport:
            return merge(def, assessSupport());
        case TemplateType.DateTree:
            return merge(def, dateTree());
        default:
            return def;
    }
}