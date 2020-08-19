export const runMain = (main: () => Promise<void>): void => {
  main()
    .catch(error => {
      console.error(error);
      process.exit(1);
    })
    .then(() => {
      process.exit(0);
    });
};
