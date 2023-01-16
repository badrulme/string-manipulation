import Button from 'antd/es/button';
import Form from 'antd/es/form';
import { Col, Row } from 'antd/es/grid';
import Input from 'antd/es/input';
type Props = {};

export default function JavaPropertiesFileConverter({ }: Props) {

    const [inputForm] = Form.useForm();
    const [outputForm] = Form.useForm();

    const handleUserInput = (e: any) => {
        outputForm.setFieldValue('outputText', '');
        let inputText = e.inputText;

        let splitedLine = splitByNewLine(inputText);

        let generatedOutput = '';
        splitedLine.forEach(element => {

            let generatedLine = '';

            if (element.match(/^#/g)) {
                generatedLine += '//\t' + element + '\n';
            } else {
                element = element.replace(/\s*=.+$/g, '');
                generatedLine = '' +
                    '@Value("${' + element + '}")\n' +
                    'public static String ' +
                    (replaceDotToUnderscore(camelToSnakeCase(element)).toUpperCase())
                        .replace(/^_/, '').replace(/=/, '') +
                    ';\n\n';
            }

            generatedOutput += generatedLine;
        });

        outputForm.setFieldValue('outputText', generatedOutput);

    }

    // /* snake case to camel case Lower*/
    // const snakeCaseToCamelCaseLower = (input: string) => {
    //     return input.split('_')
    //         .reduce((res, word, i) => i === 0 ? word.toLowerCase() :
    //             `${res}${word.charAt(0).toUpperCase()}${word.substr(1).toLowerCase()}`, '');

    // }

    /* camel Case to snake case */
    const camelToSnakeCase = (str: string) => str.replace(/[A-Z].+/g, letter => `_${letter.toLowerCase()}`);

    const replaceDotToUnderscore = (value: string) => {
        return value.replace(/\./g, '_');
    }


    const splitByNewLine = (value: string) => {
        return value.split(/\n|\r/g).filter(e => e);
    }

    return (
        <>
            <Row gutter={10}>
                <Col span={12}>
                    <Form
                        form={inputForm}
                        onFinish={handleUserInput}
                        layout='vertical'
                    >
                        <Form.Item
                            name="inputText"
                            label="Enter Key(s)"
                            rules={[{ required: true, message: 'Required' }]}

                        >
                            <Input.TextArea
                                showCount
                                maxLength={20000}
                                rows={15}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">Run</Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Form form={outputForm}
                        layout='vertical'
                    >
                        <Form.Item
                            name="outputText"
                            label="Enter Key(s)"
                        >
                            <Input.TextArea
                                showCount
                                maxLength={50000}
                                rows={15}
                                readOnly={true}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

        </>
    )
}