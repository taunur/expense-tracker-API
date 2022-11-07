// Module berisi fungsi-fungsi yang berkaitan dengan query ke database
const prisma = require('../helpers/database')
const bcrypt = require('bcrypt') // package hash password
const joi = require('joi') // package validasi

class _user {
    // Read/Get user
    listUser = async() => {
        try{
            const list = await prisma.user.findMany()
            console.log(list)

            return {
                status: true,
                data: list
            }
        } catch (error) {
            console.error('listUser user module Error: ', error)

            return{
                status: false,
                error
            }
        }
    }

    // Create/Post User
    createUser = async (body) => {
        try{
            // Validasi input
            const schema = joi.object({
                name: joi.string().required(),
                email: joi.string().required(),
                password: joi.string().required()
            }).options({ abortEarly: false })

            const validation = schema.validate(body)

            if(validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            const password = bcrypt.hashSync(body.password, 10)

            const add = await prisma.user.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password
                }
            })

            return {
                status: true,
                code: 201, //sukses membuat create data
                data: add
            }
        } catch (error) {
            console.error('createUser user module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }

    // Update/Put User
    updateUser = async (body) => {
        try{
            // Validasi input
            const schema = joi.object({
                id: joi.number().required(),
                name: joi.string(),
                email: joi.string(),
                password: joi.string()
            }).options({ abortEarly: false })

            const validation = schema.validate(body)

            if(validation.error) {
                const errorDetails = validation.error.details.map(detail => detail.message)

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(', ')
                }
            }

            if(body.password) {
                body.password = bcrypt.hashSync(body.password, 10)
            }

            const update = await prisma.user.update({
                where: {
                    id: body.id
                },
                data: {
                    name: body.name,
                    email: body.email,
                    password: body.password
                }
            })

            return{
                status: true,
                data: update
            }

        } catch (error) {
            console.error('updateUser user module Error: ', error)

            return{
                status: false,
                error
            }
        }
    }

    // Delete User
    // Menghapus data user hanya perlu memanggil id saja berupa number
    deleteUser = async(id) => {
        try{
            const schema = joi.number().required()

            const validation = schema.validate(id)

            if(validation.error) {
                const errorDetails = validate.error.details.map(detail => detail.message)

                return{
                    status: false,
                    code: 422,
                    error: errorDetails
                }
            }

            const del = await prisma.user.delete({
                where: {
                    id: id
                }
            })

            return {
                status: true,
                data: del
            }

        } catch (error) {
            console.error('deleteUser user module Error: ', error)

            return {
                status: false,
                error
            }
        }
    }
}

module.exports = new _user()