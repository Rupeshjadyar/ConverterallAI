/* global Module */
importScripts('./qpdf.js');

self.onmessage = async ({ data: { file, operation, password } }) => {
  try {
    const qpdf = await Module({ print() {}, printErr() {} });
    qpdf.FS.mkdir('/source');
    qpdf.FS.mount(qpdf.WORKERFS, { blobs: [{ name: 'input.pdf', data: file }] }, '/source');

    const source = '/source/input.pdf';
    const output = '/output.pdf';
    let args;
    if (operation === 'protect') {
      const ownerPassword = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte =>
        byte.toString(16).padStart(2, '0')).join('');
      args = [source, '--encrypt', '--user-password=' + password,
        '--owner-password=' + ownerPassword, '--bits=256', '--', output];
    } else if (operation === 'unlock') {
      args = ['--password=' + password, '--decrypt', source, output];
    } else if (operation === 'optimize') {
      args = ['--object-streams=generate', '--compress-streams=y', '--recompress-flate', source, output];
    } else {
      throw new Error('Unknown PDF operation');
    }

    if (qpdf.callMain(args) !== 0) throw new Error('PDF processing failed');
    const bytes = qpdf.FS.readFile(output);
    self.postMessage({ bytes }, [bytes.buffer]);
  } catch {
    self.postMessage({ failed: true });
  }
};
