import { HttpRequestItem } from 'cyia-ngx-common';
// import { ModelViewPropertyConfig } from "cyia-ngx-form";
// export interface DialogData {
//     list: any[]//传入数据
//     /**定义配置 */
//     config: ModelViewPropertyConfig[];
//     /**显示标题 */
//     title: string;
//     /**最终的请求 */
//     req: HttpRequestItem;
//     /**按钮 */
//     buttons: ButtonDialogItem[];
//     /**最终请求前需要做的 */
//     submitOnBefore: () => Promise<any>
// }
interface ButtonDialogItem {
    type?: 'submit' | 'cancel' | 'other';
    label: string;
    fn: () => void
}