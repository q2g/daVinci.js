import { strings } from "@angular-devkit/core";
import {
    Rule,
    Tree,
    template,
    apply,
    move,
    url,
    chain,
    branchAndMerge,
    mergeWith
} from "@angular-devkit/schematics";
import { getProject } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";

export function gauguinLib(options: any): Rule {
    return (tree: Tree) => {

        if (!options.project) {
            throw { message: "no way" };
        }

        const project = getProject(tree, options.project);
        const parsedLibPath = parseName(`${project.sourceRoot}`, options.name);
        const parsedTestPath = parseName(`${project.root}/tests`, options.name);

        options.selector = `${project.prefix}-${options.name}`;

        const templateSource = apply(url("./files/lib"), [
            template({
                ...strings,
                ...options
            }),
            move(parsedLibPath.path)
        ]);

        const testSource = apply(url("./files/tests"), [
            template({
                ...strings,
                ...options
            }),
            move(parsedTestPath.path)
        ]);

        return chain([
            branchAndMerge(
                chain([
                    // addDeclarationToNgModule(options),
                    mergeWith(templateSource),
                    mergeWith(testSource)
                ])
            )
        ]);
    };
}
