import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';


const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');

        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const matterResult = matter(fileContents);

        return {
            id, 
            ...matterResult.data
        };
    });

    return allPostsData.sort(({date: a}, {date: b}) => {
        // sorts dates in descending order (newer dates come before older dates)
        if (a < b){
            // if a is an older date than b, then put it after b.
            return 1;
        } else if (a > b){
            // if a is a newer date than b, then put it before b.
            return -1;
        }else{
            // Otherwise, if they are the same, then leave them as they are.
            return 0;
        }
    });
}

export function getAllPostIds(){
    const fileNames = fs.readdirSync(postsDirectory);

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        };
    });
}

export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
        id,
        contentHtml,
        ...matterResult.data
    };
}









