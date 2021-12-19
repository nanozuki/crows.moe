module.exports = ({env}) => ({
  upload : {
    provider : 'aws-s3',
    providerOptions : {
      accessKeyId : env('STORAGE_ACCESS_KEY'),
      secretAccessKey : env('STORAGE_SECRET_KEY'),
      endpoint : 'us-east-1.linodeobjects.com',
      params : {
        Bucket : 'strapi',
      },
    },
  },
});
