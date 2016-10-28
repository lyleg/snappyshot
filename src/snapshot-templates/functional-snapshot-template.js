export default function functionalSnapshotTemplate(options){
  let {name, filePath} = options
  let template =
`import ${name} from '${filePath}'
  it('default snapshot for ${name}', () => {
    expect().toMatchSnapshot();
  });`
    return template
  }
